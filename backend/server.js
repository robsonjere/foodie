require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/daily-logs', require('./routes/dailyLogs'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Foodie API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Foodie API running on port ${PORT}`);
});
