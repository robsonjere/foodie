const express = require('express');
const router = express.Router();
const dailyLogController = require('../controllers/dailyLogController');
const authenticateToken = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

router.get('/single', dailyLogController.getDailyLog);
router.get('/range', dailyLogController.getDailyLogs);
router.put('/water', dailyLogController.updateWaterIntake);
router.get('/stats', dailyLogController.getSummaryStats);

module.exports = router;
