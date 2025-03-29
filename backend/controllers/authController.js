// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Received signup request:', { username, email });

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        console.log('Checking existing user:', existingUser);

        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        console.log('Generated salt:', salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashed password:', hashedPassword);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        console.log('Creating new user:', newUser);

        await newUser.save();
        console.log('User saved successfully:', newUser._id);

        // Generate JWT token
        console.log('Generating JWT token...');
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables.');
            return res.status(500).json({ message: 'Internal server error' });
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log('Generated token:', token);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
            console.error('JWT_SECRET or REFRESH_SECRET missing in .env');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '30d' });

        console.log('Login successful:', user.email);
        res.status(200).json({ success: true, accessToken, refreshToken, email: user.email, username: user.username, });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(403).json({ message: 'Refresh token required' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) {
                console.error('Invalid refresh token:', err);
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' });
            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};