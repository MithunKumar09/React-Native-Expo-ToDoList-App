//server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const app = express();

// Middleware
app.use(express.json());

// CORS FIX (Allow Requests from Mobile Device)
const corsOptions = {
    origin: '*', // Change this to your frontend IP (if static)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
