import mongoose from 'mongoose';

const notificationTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false
    },

    // auto-delete meeting after 1 year
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        index: { expires: 0 },
        select: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Notification = mongoose.model('Notification', notificationTokenSchema);
export default Notification;
