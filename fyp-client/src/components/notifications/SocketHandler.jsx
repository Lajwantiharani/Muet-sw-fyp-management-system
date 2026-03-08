import { socket } from "@utils";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const SocketHandler = () => {
    const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?._id) {
            socket.auth = { token };
            socket.connect();
            socket.emit("join", user._id);
        }

        return () => {
            socket.disconnect();
        };
    }, [user, token]);

    return null;
}

export default SocketHandler;
