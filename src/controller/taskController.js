const Task = require('../models/task');
const User = require('../models/user');
const { sendResponse } = require('../utility/api');

const isAuthorizedToManageTask = async (user, task) => {
    if (user.role === 1) return true; 
    if (user.role === 2) {
        const manager = await User.findById(user.id).populate('assignedUsers', '_id');
        const assignedUserIds = manager.assignedUsers.map(u => u._id.toString());
        return user.id === task.createdBy.toString() || assignedUserIds.includes(task.createdBy.toString());
    }
    return user.id === task.createdBy.toString();
};

const createTask = async (req, res) => {
    const { title, description, dueDate, status } = req.body;
    try {
        const task = await Task.create({
            title,
            description,
            dueDate,
            status,
            createdBy: req.user.id,
        });
        return sendResponse(res, 200, "Task created successfully", [], task);
    } catch (error) {
        return sendResponse(res, 500, `Error creating task: ${error.message}`);
    }
};

const getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 1) {
            tasks = await Task.find(); 
        } else if (req.user.role === 2) {
            const manager = await User.findById(req.user.id).populate('assignedUsers', '_id');
            const assignedUserIds = manager.assignedUsers.map(user => user._id);
            tasks = await Task.find({
                $or: [
                    { createdBy: req.user.id },
                    { createdBy: { $in: assignedUserIds } }
                ]
            });
        } else {
            tasks = await Task.find({ createdBy: req.user.id });
        }
        return sendResponse(res, 200, "Task data fetched successfully", [], tasks);
    } catch (error) {
        return sendResponse(res, 500, `Error fetching tasks: ${error.message}`);
    }
};

const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return sendResponse(res, 404, "Task not found");
        }
        return sendResponse(res, 200, "Task data fetched successfully", [], task);
    } catch (error) {
        return sendResponse(res, 500, `Error fetching task: ${error.message}`);
    }
};

const getTaskByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.find({createdBy:{id}});
        if (!task) {
            return sendResponse(res, 404, "Task not found");
        }
        return sendResponse(res, 200, "Task data fetched successfully", [], task);
    } catch (error) {
        return sendResponse(res, 500, `Error fetching task: ${error.message}`);
    }
};

const editTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return sendResponse(res, 404, "Task not found");
        }

        if (!(await isAuthorizedToManageTask(req.user, task))) {
            return sendResponse(res, 403, "Unauthorized to update this task");
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;

        await task.save();
        return sendResponse(res, 200, "Task updated successfully", [], task);
    } catch (error) {
        return sendResponse(res, 500, `Error updating task: ${error.message}`);
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return sendResponse(res, 404, "Task not found");
        }
        if (!(await isAuthorizedToManageTask(req.user, task))) {
            return sendResponse(res, 403, "Unauthorized to delete this task");
        }
        await Task.deleteOne({ _id: id });
        return sendResponse(res, 200, "Task deleted successfully");
    } catch (error) {
        return sendResponse(res, 500, `Error deleting task: ${error.message}`);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    editTask,
    deleteTask,
};
