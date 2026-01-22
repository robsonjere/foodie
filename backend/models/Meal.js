const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
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
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'],
      required: true,
    },
    foods: [mealItemSchema],
    totalCalories: {
      type: Number,
      default: 0,
    },
    totalProtein: {
      type: Number,
      default: 0,
    },
    totalCarbs: {
      type: Number,
      default: 0,
    },
    totalFat: {
      type: Number,
      default: 0,
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

// Pre-save hook to calculate totals
mealSchema.pre('save', async function (next) {
  if (this.foods.length === 0) {
    this.totalCalories = 0;
    this.totalProtein = 0;
    this.totalCarbs = 0;
    this.totalFat = 0;
    return next();
  }

  const Food = mongoose.model('Food');
  let totalCal = 0, totalPro = 0, totalCarb = 0, totalFt = 0;

  for (const item of this.foods) {
    const food = await Food.findById(item.foodId);
    if (food) {
      totalCal += food.calories * item.quantity;
      totalPro += (food.protein || 0) * item.quantity;
      totalCarb += (food.carbohydrates || 0) * item.quantity;
      totalFt += (food.fat || 0) * item.quantity;
    }
  }

  this.totalCalories = totalCal;
  this.totalProtein = totalPro;
  this.totalCarbs = totalCarb;
  this.totalFat = totalFt;

  next();
});

module.exports = mongoose.model('Meal', mealSchema);
