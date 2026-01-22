const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodie';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    
    // Initialize default food items if database is empty
    const Food = require('../models/Food');
    const foodCount = await Food.countDocuments();
    
    if (foodCount === 0) {
      await Food.insertMany(require('./defaultFoods.json'));
      console.log('Default food items loaded');
    }
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
