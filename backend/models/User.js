const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please add an email']
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    // optional user settings
    settings: {
        theme: {
            type: String,
            default: 'light'
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
