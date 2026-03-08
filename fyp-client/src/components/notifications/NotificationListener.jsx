import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@utils";
import { receiveNotification } from "@features";

const NotificationListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNotification = (notification) => {
      dispatch(receiveNotification(notification));
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [dispatch]);

  return null;
}

export default NotificationListener;
