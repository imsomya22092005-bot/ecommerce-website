const User = require('../models/userModel');
const bcrypt = require('bcrypt');


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (username) {
            user.username = username;
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                email
            });

            if (existingUser) {
                return res.status(400).json({
                    message: 'Email is already in use'
                });
            }

            user.email = email;
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            users
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById
};