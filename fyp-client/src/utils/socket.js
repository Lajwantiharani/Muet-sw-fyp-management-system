import { API_BASE_URL } from "@config";
import { io } from "socket.io-client";

const socket = io(API_BASE_URL, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"]
});

export default socket;