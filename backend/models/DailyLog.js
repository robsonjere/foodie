const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    meals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
      },
    ],
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
    totalCaloriesConsumed: {
      type: Number,
      default: 0,
    },
    totalCaloriesBurnt: {
      type: Number,
      default: 0,
    },
    netCalories: {
      type: Number,
      default: 0,
    },
    waterIntake: {
      type: Number,
      default: 0, // in liters
    },
    notes: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for efficient querying
dailyLogSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
