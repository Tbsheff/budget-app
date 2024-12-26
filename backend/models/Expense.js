const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        required: [true, 'Please specify an expense category']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    amount: {
        type: Number,
        required: [true, 'Please specify the expense amount']
    },
    date: {
        type: Date,
        default: Date.now
    },
    frequency: {
        type: String,
        enum: ['once', 'monthly', 'yearly', 'weekly', 'biweekly', 'quarterly'],
        default: 'once'
    },
    isRecurring: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
