const express = require('express');
const { createTask, getTasks, updateTask, getTaskById, editTask, deleteTask } = require('../controller/taskController');
const { protect } = require('../middlewares/auth');
const { createTaskValidation, requestValidation } = require('../validations');
const router = express.Router();


router.post('/create', protect, createTaskValidation, requestValidation, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, editTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;