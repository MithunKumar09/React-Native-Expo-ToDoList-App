const Task = require('../models/Task');
const cron = require('node-cron');
const moment = require('moment');

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;
        const { status } = req.body;

        console.log(`🔹 Status update request for Task ID: ${taskId} by User ID: ${userId}`);
        console.log(`🔹 New Status: ${status}`);

        const userTasks = await Task.findOne({ userId });

        if (!userTasks) {
            console.warn("⚠️ No tasks found for this user.");
            return res.status(404).json({ error: "No tasks found." });
        }

        // Find the task
        const taskIndex = userTasks.tasks.findIndex(task => task._id.toString() === taskId);
        
        if (taskIndex === -1) {
            console.warn("⚠️ Task not found.");
            return res.status(404).json({ error: "Task not found." });
        }

        // Update the status
        userTasks.tasks[taskIndex].status = status;
        await userTasks.save();

        console.log("✅ Task status updated successfully:", {
            taskId,
            newStatus: status
        });

        res.status(200).json({ message: "Task status updated successfully", tasks: userTasks.tasks });
    } catch (error) {
        console.error("❌ Error updating task status:", {
            message: error.message,
            stack: error.stack,
            code: error.code || 'N/A'
        });

        res.status(500).json({ error: "Server error. Failed to update task status." });
    }
};

// Update Expired Tasks Automatically
// Update Expired Tasks Automatically
exports.updateExpiredTasks = async () => {
    try {
        const currentDateTime = moment(); // Use moment() for consistent timezone handling
        let updatedTasks = 0;

        console.log(`🔄 Checking expired tasks at: ${currentDateTime.toISOString()}`);

        // Fetch users who have 'Scheduled' tasks
        const allTasks = await Task.find({ 'tasks.status': 'Scheduled' });

        for (const userTasks of allTasks) {
            let updated = false;

            userTasks.tasks.forEach(task => {
                try {
                    if (!task.date || !task.time) {
                        console.warn(`⚠️ Missing Date/Time for Task ID: ${task._id}. Skipping.`);
                        return;
                    }

                    // Convert 12-hour format (hh:mm AM/PM) to 24-hour format
                    const convertedTime = moment(task.time, ["h:mm A"]).format("HH:mm");

                    // Construct valid DateTime **without forcing UTC (Z)**
                    const taskDateTime = moment(`${task.date} ${convertedTime}`, "YYYY-MM-DD HH:mm");

                    if (!taskDateTime.isValid()) {
                        console.warn(`⚠️ Invalid Date-Time for Task ID: ${task._id}. Skipping.`);
                        return;
                    }

                    console.log(`📌 Task ID: ${task._id} | Scheduled for: ${taskDateTime.format()} | Current Time: ${currentDateTime.format()}`);

                    // Mark as expired if the current time has passed the scheduled time
                    if (taskDateTime.isBefore(currentDateTime) && task.status === 'Scheduled') {
                        console.log(`⚠️ Updating Task ID: ${task._id} to 'Incompleted' (Missed Deadline)`);
                        task.status = 'Incompleted';
                        updated = true;
                        updatedTasks++;
                    }
                } catch (error) {
                    console.error(`❌ Error parsing date for Task ID: ${task._id}:`, error.message);
                }
            });

            // Save only if a task was updated
            if (updated) {
                await userTasks.save();
            }
        }

        if (updatedTasks > 0) {
            console.log(`✅ ${updatedTasks} expired task(s) updated to 'Incompleted'.`);
        } else {
            console.log("✅ No expired tasks found at this time.");
        }
    } catch (error) {
        console.error("❌ Error updating expired tasks:", error.message);
    }
};


// Ensure cron job runs reliably every minute
cron.schedule('* * * * *', async () => {
    console.log("🔄 Running scheduled task check...");
    try {
        await exports.updateExpiredTasks();
    } catch (error) {
        console.error("❌ Cron job error:", error.message);
    }
});

// Create a new Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, date, time } = req.body;
        const userId = req.user?.id;

        console.log('🔹 Incoming request:', { title, description, date, time, userId });
        console.log('🔹 Authorization Header:', req.headers.authorization);

        if (!userId) {
            console.error('❌ Authentication error: User ID is missing');
            return res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
        }

        if (!title || !description || !date || !time) {
            console.warn('⚠️ Validation error: Missing required fields.');
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Convert time to 24-hour format before constructing date-time string
        const timeParts = time.match(/(\d+):(\d+) (\w+)/);
        if (!timeParts) {
            console.warn("⚠️ Invalid Time format received:", time);
            return res.status(400).json({ error: "Invalid Time format. Ensure time is in 'hh:mm AM/PM' format." });
        }

        let [_, hours, minutes, period] = timeParts;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        const taskDateTimeStr = `${date}T${formattedTime}:00.000Z`;
        const taskDateTime = new Date(taskDateTimeStr);

        if (isNaN(taskDateTime.getTime())) {
            console.warn("⚠️ Invalid Date/Time format received:", taskDateTimeStr);
            return res.status(400).json({ error: "Invalid Date/Time format. Ensure date is 'YYYY-MM-DD' and time is 'hh:mm AM/PM'." });
        }

        const taskData = { title, description, date, time, status: 'Scheduled' };
        console.log('📌 Task data to be stored:', taskData);

        let userTasks = await Task.findOne({ userId });

        if (!userTasks) {
            console.log('📌 No existing tasks found for user. Creating new task document.');
            userTasks = new Task({ userId, tasks: [taskData] });
        } else {
            console.log('📌 Existing tasks found. Adding new task.');
            userTasks.tasks.push(taskData);
        }

        await userTasks.save();
        console.log('✅ Task stored successfully:', taskData);

        res.status(201).json({ message: 'Task added successfully', tasks: userTasks.tasks });
    } catch (error) {
        console.error('❌ Error creating task:', {
            message: error.message,
            stack: error.stack,
            code: error.code || 'N/A'
        });

        res.status(500).json({ error: 'Server error. Failed to add task.' });
    }
};


// Get all tasks for authenticated user
exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const userTasks = await Task.findOne({ userId });

        if (!userTasks) {
            return res.status(200).json({ tasks: [] });
        }

        res.status(200).json(userTasks.tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Server error. Failed to fetch tasks.' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;

        console.log(`🔹 Delete request received for Task ID: ${taskId} by User ID: ${userId}`);

        const userTasks = await Task.findOne({ userId });

        if (!userTasks) {
            console.warn("⚠️ No tasks found for this user.");
            return res.status(404).json({ error: "No tasks found." });
        }

        // Find and remove the task
        const updatedTasks = userTasks.tasks.filter(task => task._id.toString() !== taskId);

        if (updatedTasks.length === userTasks.tasks.length) {
            console.warn("⚠️ Task not found.");
            return res.status(404).json({ error: "Task not found." });
        }

        userTasks.tasks = updatedTasks;
        await userTasks.save();

        console.log("✅ Task deleted successfully:", taskId);
        res.status(200).json({ message: "Task deleted successfully", tasks: userTasks.tasks });

    } catch (error) {
        console.error("❌ Error deleting task:", error);
        res.status(500).json({ error: "Server error. Failed to delete task." });
    }
};