const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/incomeController');

router.post('/', auth, addIncome);
router.get('/', auth, getIncomes);
router.delete('/:id', auth, deleteIncome);

module.exports = router;
