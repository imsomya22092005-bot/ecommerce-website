const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const { sendLoginEmail } = require('../utils/emailService');

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: 'Google credential is required'
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Google credential'
            });
        }

        const {
            sub: googleId,
            email,
            name,
            email_verified: emailVerified
        } = payload;

        if (!email || !emailVerified) {
            return res.status(401).json({
                success: false,
                message: 'Google email could not be verified'
            });
        }

        let user = await User.findOne({
            $or: [
                { googleId },
                { email }
            ]
        });

        if (!user) {
            user = await User.create({
                username: name || email.split('@')[0],
                email,
                googleId,
                role: 'user'
            });
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        sendLoginEmail(user).catch(error => {
            console.error('Google login email failed:', error.message);
        });

        res.status(200).json({
            success: true,
            message: 'Google login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Google login error:', error);

        res.status(401).json({
            success: false,
            message: 'Google authentication failed'
        });
    }
};

module.exports = {
    googleLogin
};