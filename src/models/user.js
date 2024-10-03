const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
            // 1: Admin
            // 2: Mangers
            // 3: User
        type: Number,
        enum: [1,2,3], //enum: Specifies the allowed values for the role 
        required:true,
    },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Only for managers
},
{ timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
