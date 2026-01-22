const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authenticateToken = require('../middleware/auth');

// Public routes - no authentication needed
router.get('/search', foodController.searchFoods);
router.get('/category/:category', foodController.getFoodsByCategory);
router.get('/', foodController.getAllFoods);
router.get('/:id', foodController.getFoodById);

// Admin routes (would need role verification)
router.post('/', authenticateToken, foodController.addFood);
router.put('/:id', authenticateToken, foodController.updateFood);
router.delete('/:id', authenticateToken, foodController.deleteFood);

module.exports = router;
