import validateMongooseObjectId from "../../utils/libs/database/validate.mongoose.object.id.js";
import tryCatch from "../../utils/libs/helper/try.catch.js";
import notificationService from "../services/notification.service.js";

// RETRIEVE ALL NOTIFICATIONS
const index = (req, res) => tryCatch(async () => {
    // retrieve all the user specific notificaitons
    const notifications = await notificationService.retrieveAll(req.user._id);

    // return success response with all user related notifications
    return res.response(200, "All your notifications", { notifications });
}, res);

// MARK ALL NOTIFICATIONS AS READ
const markAllAsRead = (req, res) => tryCatch(async () => {
    // mark as read the actual record in the database
    const notifications = await notificationService.markAllAsRead();

    // return back with success response
    return res.response(200, "The all notifications were marked as read", { notifications });
}, res);

// MARK SPECIFIED NOTIFICATION AS READ
const markAsRead = (req, res) => tryCatch(async () => {
    // destructure the req parameters
    const { notificationId } = req.params;

    // validate whether the provided ID is valid or not
    validateMongooseObjectId(notificationId);

    // mark as read the actual record in the database
    const notification = await notificationService.markAsRead(notificationId);

    // return back with success response
    return res.response(200, "The notification was marked as read", { notification });
}, res);

export default { index, markAllAsRead, markAsRead }