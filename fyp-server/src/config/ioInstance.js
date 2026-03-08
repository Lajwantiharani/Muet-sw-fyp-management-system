import { Server } from "socket.io";
import env from "./env.js";
import validateAndDecodeToken from "../utils/libs/helper/validate.and.decode.token.js";
import userService from "../app/services/user.service.js";

let ioInstance = null;

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: env.client.origin,
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        try {
            const { id } = await validateAndDecodeToken(socket.handshake.auth.token);
            socket.user = await userService.retrieveOne({ _id: id });

            socket.join(socket.user._id.toString());
            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        socket.on("disconnect", () => {});
    });

    ioInstance = io;
    return io;
};

export const getSocket = () => ioInstance;
export { setupSocket };
