import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrieveNotifications, markNotificationAsRead, markNotificationsAllAsRead } from "@features";
import clsx from "clsx";
import { FaArrowLeft, FaRegBell, FaRegBellSlash } from "react-icons/fa";
import { formatDateTime, timeDifference } from "@utils";

const NotificationPanel = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const [active, setActive] = useState(null);

    useEffect(() => {
        dispatch(retrieveNotifications());
    }, [dispatch]);

    const handleClick = (notif) => {
        setActive(notif);
        if (!notif.isRead) {
            dispatch(markNotificationAsRead(notif._id));
        }
    };

    const handleBack = () => {
        setActive(null);
    };

    const handleMarkAllRead = () => {
        dispatch(markNotificationsAllAsRead());
    };

    return (
        <div className="w-[300px] max-w-md bg-primary border border-primary rounded-md shadow-lg relative">
            {active ? (
                <div className="space-y-2 w-full p-4">
                    <div className="flex flex-col items-start space-y-2">
                        <button onClick={handleBack} className="flex justify-center items-center gap-2 text-xs text-secondary hover:text-secondary-hover">
                            <FaArrowLeft /> Notifications
                        </button>
                        <h2 className="text-sm text-primary">{active?.title ?? "Notification"}</h2>
                    </div>
                    <p className="text-xs text-secondary">{active?.message ?? "Notification message"}</p>
                    <p className="text-xs text-secondary text-right">{formatDateTime(active.createdAt, true)}</p>
                </div>
            ) : (
                <Fragment>
                    <div className="w-full px-4 py-3 border-b text-sm border-primary">
                        Notifications
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications?.length > 0 ? notifications.map((notif, i) => {
                            const isUnread = !notif.isRead;
                            return (
                                <div
                                    key={notif._id}
                                    onClick={() => handleClick(notif)}
                                    className={clsx(
                                        "flex items-center gap-2 cursor-pointer px-4 py-[0.17rem] text-sm w-full",
                                        isUnread ? "bg-primary" : "bg-secondary",
                                        isUnread ? "hover:bg-primary-hover" : "hover:bg-secondary-hover",
                                        { "border-b border-primary": i < notifications.length - 1 }
                                    )}
                                >
                                    {isUnread ? <FaRegBell className="text-primary shrink-0 mt-0.5" /> : <FaRegBellSlash className="text-secondary shrink-0 mt-0.5" />}
                                    <div className="w-full overflow-auto">
                                        <div className="flex justify-between gap-2">
                                            <p
                                                className={clsx(
                                                    "font-medium truncate text-sm max-w-[calc(100%-60px)]",
                                                    isUnread ? "text-primary" : "text-secondary"
                                                )}
                                                title={notif.title}
                                            >
                                                {notif.title}
                                            </p>
                                            <span className="text-xs text-secondary whitespace-nowrap shrink-0">
                                                {timeDifference(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-secondary truncate">{notif.message}</p>
                                    </div>
                                </div>
                            );
                        }) : (<p className="text-center text-sm text-secondary py-3">No Notifications!</p>)}
                    </div>

                    <div
                        className={clsx(
                            "w-full py-1.5 text-xs text-center border-t border-primary",
                            unreadCount > 0 ? "cursor-pointer text-secondary hover:text-primary" : "text-secondary"
                        )}
                        onClick={() => unreadCount > 0 && handleMarkAllRead()}
                    >
                        Mark all as read
                    </div>

                </Fragment>
            )
            }
        </div >
    );
};

export default NotificationPanel;
