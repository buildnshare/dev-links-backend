const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Group name is required'],
        unique: true,
        trim: true
    },
    isPrivate: {
        type: Boolean,
        default: true // Default to private unless explicitly made public
    }
}, { timestamps: true }); // Uses default 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model('Group', GroupSchema);