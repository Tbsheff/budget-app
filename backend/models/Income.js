// const mongoose = require('mongoose');

// const incomeSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     source: {
//         type: String,
//         required: [true, 'Please specify the income source']
//     },
//     amount: {
//         type: Number,
//         required: [true, 'Please specify the amount']
//     },
//     frequency: {
//         type: String,
//         enum: ['monthly', 'yearly', 'weekly', 'biweekly', 'quarterly'],
//         default: 'monthly'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Income', incomeSchema);
