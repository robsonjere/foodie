const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
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
    exerciseType: {
      type: String,
      enum: ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'sports', 'hiit', 'other'],
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in minutes
    },
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate',
    },
    caloriesBurnt: {
      type: Number,
      required: true,
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

module.exports = mongoose.model('Exercise', exerciseSchema);
