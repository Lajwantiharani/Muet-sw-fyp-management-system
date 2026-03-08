import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@components";

const MeetingButton = ({ meeting, user, ...props }) => {
    const [label, setLabel] = useState("Loading...");
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const scheduleTime = new Date(meeting?.schedule);
        const endsAtTime = meeting?.endsAt ? new Date(meeting?.endsAt) : null;

        const updateStatus = () => {
            const now = new Date();

            if (meeting?.status === "ended") {
                setLabel("Meeting Ended");
                setIsDisabled(true);
                return;
            }

            if (endsAtTime && endsAtTime < now) {
                setLabel("Meeting Expired");
                setIsDisabled(true);
                return;
            }

            const diffMs = scheduleTime - now;
            if (diffMs > 24 * 60 * 60 * 1000) {
                setLabel(`Meeting on ${format(scheduleTime, "PPpp")}`);
                setIsDisabled(true);
                return;
            }

            if (diffMs > 0) {
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
                setLabel(`Starts in ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
                setIsDisabled(true);
                return;
            }

            setLabel(user?.role != meeting?.scheduledBy ? "Join Meeting" : "Start Meeting");
            setIsDisabled(false);
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, [meeting?.schedule, meeting?.endsAt, meeting?.status, meeting?.scheduledBy, user?.role]);

    return (
        <Button {...props} disabled={isDisabled}>
            {label}
        </Button>
    );
};

export default MeetingButton;
