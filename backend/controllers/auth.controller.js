const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: 'Google credential is required.' });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        // Find existing user and sync latest Google profile, or create new one
        let user = await User.findOneAndUpdate(
            { email },
            { $set: { name, googleId, picture } },
            { returnDocument: 'after' }
        );
        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                picture,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture || picture,
            },
        });
    } catch (err) {
        console.error('Google login error:', err.message);
        res.status(401).json({ error: 'Google authentication failed.' });
    }
};

