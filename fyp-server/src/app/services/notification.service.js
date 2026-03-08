import tryCatch from '../../utils/libs/helper/try.catch.js';
import Notification from '../models/notification.model.js';
import { getSocket } from '../../config/ioInstance.js'
import userService from './user.service.js';

// function to retrieve all notifications related to specific user
const retrieveAll = async (userId) => tryCatch(async () => {
    // return all user specific notifications in descending order
    return Notification.find({ userId }).sort({ createdAt: -1 });
});

// function to mark specific notification as read
const push = async (notification, ...userIds) => tryCatch(async () => {
    // get socket.io server instance
    const io = getSocket();

    let ids = userIds.flat().filter(id => id != "admins");
    if (userIds.includes("admins")) {
        const adminIds = await userService.adminIds();
        ids = [...ids, ...adminIds];
    }

    // create and push the notification(s) for concerned user(s)
    for (const userId of ids.filter(Boolean)) {
        const newNotification = await Notification.create({
            userId: String(userId),
            title: notification.title,
            message: notification.message,
        });

        // push the created notification to the concerned user
        if (io) io.to(userId).emit("notification", newNotification);
    }
});

// function to mark all notifications as read
const markAllAsRead = async () => tryCatch(async () => {
    // mark the specified notfication as read
    await Notification.updateMany({ isRead: false }, { $set: { isRead: true } }).sort({ createdAt: -1 });

    // return all notiications
    return await Notification.find({});
});

// function to mark specific notification as read
const markAsRead = async (id) => tryCatch(async () => {
    // mark the specified notfication as read
    return await Notification.findByIdAndUpdate(id, { $set: { isRead: true } }, { new: true });
});

export default { retrieveAll, push, markAllAsRead, markAsRead };