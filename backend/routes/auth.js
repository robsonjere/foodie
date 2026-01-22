const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/demo-login', authController.demoLogin);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;
