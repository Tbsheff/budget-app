const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Update user settings (theme, currency, etc.)
exports.updateUserSettings = async (req, res) => {
    try {
        const { theme, currency } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                settings: { theme, currency }
            },
            { new: true }
        ).select('-password');

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};
