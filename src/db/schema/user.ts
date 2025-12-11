const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // Primary ID is automatically created by Mongoose
    
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true
    },
    passwordHash: { // Store the hashed password (e.g., using bcrypt)
        type: String,
        required: [true, 'Password hash is required']
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date,
        default: null
    }
}, { timestamps: { createdAt: 'joinedAt', updatedAt: 'updatedAt' } }); // Use Mongoose timestamps feature

module.exports = mongoose.model('User', UserSchema);