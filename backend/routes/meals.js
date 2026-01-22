const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const authenticateToken = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

router.post('/', mealController.createMeal);
router.get('/date-range', mealController.getMealsByDateRange);
router.get('/by-date', mealController.getMealsByDate);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);

module.exports = router;
