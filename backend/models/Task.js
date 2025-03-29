//models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true }, // Indexed for quick lookup
    tasks: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            date: { type: String, required: true }, // Store date as string (YYYY-MM-DD)
            time: { type: String, required: true }, // Store time as string (HH:mm AM/PM)
            status: { type: String, enum: ['Scheduled', 'Completed', 'Incompleted'], default: 'Scheduled' },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Task', TaskSchema);
