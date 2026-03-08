import './src/utils/extensions/object.js';
import './src/utils/extensions/array.js';
import './src/utils/extensions/string.js';
import './src/utils/libs/helper/cron.js';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import env from './src/config/env.js';
import database from './src/config/database.js';
import application from './src/app/middlewares/app.js';
import apiRoutes from './src/app.js';
import { setupSocket } from './src/config/ioInstance.js';

// express application instance
const app = express();
app.use(express.static('public')); // serve static files from 'public' directory

// register application-level middlewares
app.use(
    cors({ origin: [env.client.origin, 'http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }),
    helmet(), // security middleware
    express.json({ limit: "16kb" }), // parse JSON request bodies
    express.urlencoded({ extended: true }),
    morgan("dev"), // logs requests
    // rateLimit({
    //     windowMs: 15 * 60 * 1000,
    //     max: 100,
    //     message: "Too many requests, Please try again later",
    //     standardHeaders: true,
    //     legacyHeaders: false,
    // }), // rate limiter middleware
    application.response, // custom response middleware
    application.errorHandler // custom error handler middleware
);

// root route
app.get("/", (_, res) => {
    const developer = {
        name: "lajwanti harani",
        email: "lajwantiharani7@gmail.com",
        role: "MERN Stack Developer",
        linkedIn: "https://linkedin.com/in/lajwantiharani"
    };
    return res.response(200, "Backend is up and fine!", { developer });
});

// register API routes
app.use('/api', apiRoutes);

// Database connection & server setup with socket.io
database.connect().then(() => {
    // socket.io setup for realtime notifications
    const server = http.createServer(app);
    setupSocket(server);

    // starting of the server for frontend request handling
    // server.listen(env.app.port, /*'0.0.0.0',*/() => {
    server.listen(env.app.port, () => {
        console.log(`Server is running on port ${env.app.port}`);
    });
}).catch((error) => {
    console.error("Database connection failed:", error);
});

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || err.statusCode || 500;
    res.response(statusCode, err.message || "Internal Server Error");
});
