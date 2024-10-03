const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteUser, editUser, getUserWithId } = require('../controller/userController');
const { protect, authorizeRoles } = require('../middlewares/auth');
const { createUserValidation, requestValidation, loginValidation } = require('../validations');

const router = express.Router();

router.post('/register', protect, authorizeRoles(1), createUserValidation, requestValidation, registerUser);
router.post('/login', loginValidation, requestValidation, loginUser);
router.get('/', protect, authorizeRoles(1), getAllUsers);
router.get('/:id', protect,  getUserWithId);
router.put('/:id', protect, authorizeRoles(1), editUser);
router.delete('/:id', protect, authorizeRoles(1), deleteUser);

module.exports = router;
