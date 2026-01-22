const DailyLog = require('../models/DailyLog');
const Meal = require('../models/Meal');
const Exercise = require('../models/Exercise');

// Get daily log
exports.getDailyLog = async (req, res) => {
  try {
    const { date } = req.query;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let dailyLog = await DailyLog.findOne({
      userId: req.userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate({
        path: 'meals',
        populate: {
          path: 'foods.foodId',
        },
      })
      .populate('exercises');

    if (!dailyLog) {
      dailyLog = new DailyLog({
        userId: req.userId,
        date: startOfDay,
      });
    }

    res.json(dailyLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logs for date range
exports.getDailyLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const logs = await DailyLog.find({
      userId: req.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate({
        path: 'meals',
        populate: {
          path: 'foods.foodId',
        },
      })
      .populate('exercises')
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update water intake
exports.updateWaterIntake = async (req, res) => {
  try {
    const { date, waterIntake } = req.body;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let dailyLog = await DailyLog.findOne({
      userId: req.userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!dailyLog) {
      dailyLog = new DailyLog({
        userId: req.userId,
        date: startOfDay,
      });
    }

    dailyLog.waterIntake = waterIntake;
    await dailyLog.save();

    res.json(dailyLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get summary stats for date range
exports.getSummaryStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const logs = await DailyLog.find({
      userId: req.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    const stats = {
      averageCaloriesConsumed:
        logs.reduce((sum, log) => sum + log.totalCaloriesConsumed, 0) / logs.length || 0,
      averageCaloriesBurnt: logs.reduce((sum, log) => sum + log.totalCaloriesBurnt, 0) / logs.length || 0,
      averageNetCalories: logs.reduce((sum, log) => sum + log.netCalories, 0) / logs.length || 0,
      totalDays: logs.length,
      averageWaterIntake: logs.reduce((sum, log) => sum + log.waterIntake, 0) / logs.length || 0,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
