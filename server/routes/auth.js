const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
router.post('/signup', async (req, res) => {
    const { username, email, password, unit, grade } = req.body;
    try {
        // Check if user exists (by email or username)
        let user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (user) {
            return res.status(400).json({ msg: 'User already exists (Email or Username taken)' });
        }

        user = new User({ username, email, password, unit, grade });
        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    unit: user.unit,
                    grade: user.grade
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    unit: user.unit,
                    grade: user.grade
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Profile
router.put('/update', async (req, res) => {
    const { token, unit, grade, name } = req.body; // Expecting token in body for simplicity, or verify middleware
    // ideally use middleware to verify token and get user from req.user

    // For quick implementation without middleware setup check (assuming token is passed or we verify it here)
    // But since we didn't see middleware file, let's verify token here or use the id if we trust the client (BAD PRACTICE but fast for prototype).
    // BETTER: Check if 'middleware/auth.js' exists.

    try {
        // Simple verification - in real app use middleware
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const userId = decoded.user.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (unit) user.unit = unit;
        if (grade) user.grade = grade;
        if (name) user.username = name;

        await user.save();

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                unit: user.unit,
                grade: user.grade
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
