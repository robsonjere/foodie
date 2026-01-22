const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const authenticateToken = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

router.post('/', exerciseController.createExercise);
router.get('/date-range', exerciseController.getExercisesByDateRange);
router.get('/by-date', exerciseController.getExercisesByDate);
router.put('/:id', exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router;
