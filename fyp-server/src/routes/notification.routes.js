import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import notificationController from "../app/controllers/notification.controller.js";

const notificationRoutes = Router({ mergeParams: true });

// retrieve all noifications
notificationRoutes.get('/',
    auth.authenticate, // middleware to authenticate request user based on JWT token
    auth.authorize("*"),  // middleware to authorize role(s) to access the route
    notificationController.index // controller method to retrieve all notifications
);

// mark all notifications as read
notificationRoutes.get('/mark-all-as-read',
    auth.authenticate, // middleware to authenticate request user based on JWT token
    auth.authorize("*"),  // middleware to authorize role(s) to access the route
    notificationController.markAllAsRead // controller method to mark all notifications as read
);
// mark specified notification as read
notificationRoutes.get('/mark-as-read/:notificationId',
    auth.authenticate, // middleware to authenticate request user based on JWT token
    auth.authorize("*"),  // middleware to authorize role(s) to access the route
    notificationController.markAsRead // controller method to mark specified notification as read
);

export default notificationRoutes;