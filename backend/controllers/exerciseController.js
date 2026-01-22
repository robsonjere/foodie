const Exercise = require('../models/Exercise');
const DailyLog = require('../models/DailyLog');

// Create exercise
exports.createExercise = async (req, res) => {
  try {
    const { date, exerciseType, duration, intensity, caloriesBurnt, notes } = req.body;

    const exercise = new Exercise({
      userId: req.userId,
      date,
      exerciseType,
      duration,
      intensity,
      caloriesBurnt,
      notes,
    });

    await exercise.save();

    // Update daily log
    await updateDailyLog(req.userId, new Date(date));

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exercises by date range
exports.getExercisesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const exercises = await Exercise.find({
      userId: req.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: -1 });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exercises by date
exports.getExercisesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const exercises = await Exercise.find({
      userId: req.userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ date: -1 });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update exercise
exports.updateExercise = async (req, res) => {
  try {
    const { duration, intensity, caloriesBurnt, notes } = req.body;

    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { duration, intensity, caloriesBurnt, notes },
      { new: true }
    );

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Update daily log
    await updateDailyLog(req.userId, new Date(exercise.date));

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete exercise
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Update daily log
    await updateDailyLog(req.userId, new Date(exercise.date));

    res.json({ message: 'Exercise deleted' });
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

    const Meal = require('../models/Meal');
    const meals = await Meal.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const exercises = await Exercise.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    let totalCaloriesConsumed = 0;
    meals.forEach((meal) => {
      totalCaloriesConsumed += meal.totalCalories;
    });

    let totalCaloriesBurnt = 0;
    exercises.forEach((ex) => {
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
    dailyLog.exercises = exercises.map((e) => e._id);
    dailyLog.totalCaloriesConsumed = totalCaloriesConsumed;
    dailyLog.totalCaloriesBurnt = totalCaloriesBurnt;
    dailyLog.netCalories = totalCaloriesConsumed - totalCaloriesBurnt;

    await dailyLog.save();
  } catch (error) {
    console.error('Error updating daily log:', error);
  }
};
