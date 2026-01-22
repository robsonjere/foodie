const Meal = require('../models/Meal');
const Food = require('../models/Food');
const DailyLog = require('../models/DailyLog');

// Create meal
exports.createMeal = async (req, res) => {
  try {
    const { date, mealType, foods, notes } = req.body;

    const meal = new Meal({
      userId: req.userId,
      date,
      mealType,
      foods,
      notes,
    });

    await meal.save();
    await meal.populate('foods.foodId');

    // Update or create daily log
    await updateDailyLog(req.userId, new Date(date));

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get meals by date range
exports.getMealsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const meals = await Meal.find({
      userId: req.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate('foods.foodId')
      .sort({ date: -1 });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get meals by date and type
exports.getMealsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userId: req.userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate('foods.foodId')
      .sort({ mealType: 1 });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update meal
exports.updateMeal = async (req, res) => {
  try {
    const { foods, notes } = req.body;

    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      { foods, notes },
      { new: true }
    ).populate('foods.foodId');

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Update daily log
    await updateDailyLog(req.userId, new Date(meal.date));

    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete meal
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Update daily log
    await updateDailyLog(req.userId, new Date(meal.date));

    res.json({ message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update daily log
const updateDailyLog = async (userId, date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate('foods.foodId');

    const exercises = require('../models/Exercise').find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    let totalCaloriesConsumed = 0;
    meals.forEach((meal) => {
      totalCaloriesConsumed += meal.totalCalories;
    });

    const Exercise = require('../models/Exercise');
    const exerciseData = await Exercise.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    let totalCaloriesBurnt = 0;
    exerciseData.forEach((ex) => {
      totalCaloriesBurnt += ex.caloriesBurnt;
    });

    let dailyLog = await DailyLog.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!dailyLog) {
      dailyLog = new DailyLog({
        userId,
        date: startOfDay,
      });
    }

    dailyLog.meals = meals.map((m) => m._id);
    dailyLog.exercises = exerciseData.map((e) => e._id);
    dailyLog.totalCaloriesConsumed = totalCaloriesConsumed;
    dailyLog.totalCaloriesBurnt = totalCaloriesBurnt;
    dailyLog.netCalories = totalCaloriesConsumed - totalCaloriesBurnt;

    await dailyLog.save();
  } catch (error) {
    console.error('Error updating daily log:', error);
  }
};
