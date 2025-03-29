//routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask, getTasks, deleteTask, updateTaskStatus } = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');

// Create task (Requires authentication)
router.post('/', verifyToken, createTask);
// Get all tasks for a user (Requires authentication)
router.get('/', verifyToken, getTasks);
// Delete a task (Requires authentication)
router.delete("/:taskId", verifyToken, deleteTask);
// Update task status (Requires authentication)
router.patch("/:taskId", verifyToken, updateTaskStatus);

module.exports = router;
