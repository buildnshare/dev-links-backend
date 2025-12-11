const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    sharedBy: { // Who added the link
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    label: {
        type: String,
        required: [true, 'A label for the link is required'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'A URL is required'],
        trim: true
        // You might add a custom validator here to ensure it's a valid URL
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    tags: [{ // Array of strings for searchability
        type: String,
        trim: true,
        lowercase: true
    }]
}, { timestamps: true });

export const LinkModel = mongoose.model('Link', LinkSchema);