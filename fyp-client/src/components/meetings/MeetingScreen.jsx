import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MeetingSdk, Overlay } from "@components";
import { ZOOM_SDK_KEY } from "@config";
import { generateSignature } from "@features";

const MeetingScreen = ({ meeting, closeForm }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { signature } = useSelector((state) => state.meetings);
    const [zakToken, setZakToken] = useState(undefined);

    useEffect(() => {
        if (!meeting?._id || !meeting?.meetingId) return;
        dispatch(
            generateSignature({
                id: meeting._id,
                meetingId: meeting.meetingId,
                role: user?.role != meeting?.scheduledBy ? 0 : 1
            })
        );

        if (user?.role == meeting?.scheduledBy) {
            const zakToken = new URL(meeting.startUrl).searchParams.get("zak");
            setZakToken(zakToken);
        }
    }, [meeting, dispatch, user?.role]);

    return (
        <Overlay
            onClose={() => closeForm(true)}
            title="Meeting Details"
            width="w-[90%] sm:w-[80%] lg:w-[70%]"
            zIndex="z-50"
            dismisible={false}
        >
            {!signature ? (
                <div className="flex items-center justify-center py-10">
                    Loading...
                </div>
            ) : (
                <div>
                    <MeetingSdk
                        meetingNumber={meeting?.meetingId}
                        userName={user?.name ?? "Guest"}
                        userEmail={user?.email ?? "guest@fyp-ms.com"}
                        password={meeting?.password}
                        sdkKey={ZOOM_SDK_KEY}
                        signature={signature}
                        zakToken={zakToken}
                        leaveUrl={window.location.origin + (user?.role != "student" ? "/meetings" : "/my-meetings")}
                    />
                </div>
            )}
        </Overlay>
    );
};

export default MeetingScreen;
