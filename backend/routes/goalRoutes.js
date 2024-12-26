const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addGoal, getGoals, updateGoal } = require('../controllers/goalController');

router.post('/', auth, addGoal);
router.get('/', auth, getGoals);
router.put('/:id', auth, updateGoal);

module.exports = router;
