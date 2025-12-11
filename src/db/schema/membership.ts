const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    role: { // Defines permissions: e.g., 'owner', 'contributor', 'reader'
        type: String,
        enum: ['owner', 'contributor', 'reader'],
        default: 'reader',
        required: true
    }
}, { timestamps: { createdAt: 'joinedAt', updatedAt: 'updatedAt' } });

// IMPORTANT: Create a unique compound index to ensure a user can only have ONE role per group
MembershipSchema.index({ userId: 1, groupId: 1 }, { unique: true });

export const MemberShipModel =  mongoose.model('Membership', MembershipSchema);