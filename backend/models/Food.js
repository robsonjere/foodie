const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['fruit', 'vegetable', 'meat', 'seafood', 'dairy', 'grain', 'snack', 'beverage', 'dessert', 'other'],
      required: true,
    },
    servingSize: {
      amount: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece'],
        required: true,
      },
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number, // in grams
    },
    carbohydrates: {
      type: Number, // in grams
    },
    fat: {
      type: Number, // in grams
    },
    fiber: {
      type: Number, // in grams
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add text index for search
foodSchema.index({ name: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Food', foodSchema);
