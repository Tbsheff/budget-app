const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please specify a goal title']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Please specify the target amount']
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Goal', goalSchema);
