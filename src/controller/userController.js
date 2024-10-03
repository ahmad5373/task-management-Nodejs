const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { sendResponse } = require('../utility/api');
const Task = require('../models/task');

dotenv.config();

const hashPassword = async (password) => bcrypt.hash(password, 10);
const findUserByEmail = async (email) => User.findOne({ email });

const createAdmin = async () => {
    try {
        const adminExists = await findUserByEmail('admin@admin.com');
        if (adminExists) {
            console.log("Admin already exists");
            return;
        }
        const hashedPassword = await hashPassword('admin123');
        const admin = new User({ name: 'Admin', email: 'admin@admin.com', password: hashedPassword, role: 1 });
        await admin.save();
        console.log("Admin user created successfully");
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, role, assignedUsers } = req.body;
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return sendResponse(res, 400, "User already exists");
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ name, email, password: hashedPassword, role, assignedUsers });
        return sendResponse(res, 201, "User Created Successfully", [], newUser);
    } catch (error) {
        return sendResponse(res, 500, `Error creating user: ${error.message}`);
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user || !await bcrypt.compare(password, user.password)) {
            return sendResponse(res, 401, "Invalid credentials");
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, { httpOnly: true });
        return sendResponse(res, 200, "Login Successful", [], token);
    } catch (error) {
        return sendResponse(res, 500, `Error during login: ${error.message}`);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ email: { $ne: req.user.email } })
            .populate('assignedUsers')
            .select('name email role assignedUsers');
            const usersWithTasks = await Promise.all(users.map(async (user) => {
            const tasks = await Task.find({ createdBy: user._id });
            return { ...user._doc, tasks };
        }));
        
        return sendResponse(res, 200, "Users fetched successfully", [], usersWithTasks);
    } catch (error) {
        return sendResponse(res, 500, `Error fetching users: ${error.message}`);
    }
};

const getUserWithId = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('name email role assignedUsers');
        if (!user) {
            return sendResponse(res, 404, "User not found");
        }
        const assignedUsers = await User.find({ _id: { $in: user.assignedUsers } })
            .select('name email role');
        const userTasks = await Task.find({ createdBy: user._id })
            .select('title description dueDate status');
        const assignedUsersWithTasks = await Promise.all(assignedUsers.map(async (assignedUser) => {
            const tasks = await Task.find({ createdBy: assignedUser._id })
                .select('title description dueDate status');
            return {
                ...assignedUser.toObject(),
                tasks
            };
        }));
        const response = {
            ...user.toObject(),
            tasksDetails: userTasks,
            assignedUsersDetails: assignedUsersWithTasks
        };
        return sendResponse(res, 200, "User details fetched successfully", [], response);
    } catch (error) {
        return sendResponse(res, 500, `Error fetching user: ${error.message}`);
    }
};

// const getUserWithId = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const userDetails = await User.aggregate([
//             { $match: { _id: new mongoose.Types.ObjectId(id) } },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'assignedUsers',
//                     foreignField: '_id',
//                     as: 'assignedUsersDetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'tasks',
//                     localField: '_id',
//                     foreignField: 'createdBy',
//                     as: 'tasksDetails'
//                 }
//             },
//             {
//                 $project: {
//                     name: 1, email: 1, role: 1,
//                     assignedUsersDetails: { _id: 1, name: 1, email: 1, role: 1 },
//                     tasksDetails: { _id: 1, title: 1, description: 1, dueDate: 1, status: 1 }
//                 }
//             }
//         ]);

//         return sendResponse(res, 200, "User details fetched successfully", [], userDetails);
//     } catch (error) {
//         return sendResponse(res, 500, `Error fetching user: ${error.message}`);
//     }
// };

const editUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, assignedUsers } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, role, assignedUsers }, { new: true, runValidators: true });
        if (!updatedUser) {
            return sendResponse(res, 404, "User not found");
        }
        return sendResponse(res, 200, "User updated successfully", [], updatedUser);
    } catch (error) {
        return sendResponse(res, 500, `Error updating user: ${error.message}`);
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return sendResponse(res, 404, "User not found");
        }
        if (user.assignedUsers.length > 0) {
            await User.deleteMany({ _id: { $in: user.assignedUsers } });
        }
        await User.updateMany({ assignedUsers: id }, { $pull: { assignedUsers: id } });
        await User.deleteOne({ _id: id });
        return sendResponse(res, 200, "User deleted successfully");
    } catch (error) {
        return sendResponse(res, 500, `Error deleting user: ${error.message}`);
    }
};

module.exports = {
    createAdmin,
    registerUser,
    loginUser,
    getAllUsers,
    getUserWithId,
    editUser,
    deleteUser,
};
