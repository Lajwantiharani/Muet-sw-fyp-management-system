import axios from "axios";
import generateZoomAccessToken from "./generateZoomAccessToken.js";

const scheduleZoomMeetingSession = async (data) => {
    try {
        const token = await generateZoomAccessToken();

        const zoomUrl = "https://api.zoom.us/v2/users/me/meetings";
        const response = await axios.post(zoomUrl,
            {
                topic: data?.title ?? "Project progress discussion",
                type: 2,
                start_time: new Date(data.schedule).toISOString(),
                duration: data?.duration ?? 10,
                agenda: data?.summary ?? "Report on project prgress",
                settings: {
                    join_before_host: false,
                    approval_type: 0,
                    registration_type: 1,
                    enforce_login: false,
                    waiting_room: true,
                    host_video: true,
                    participant_video: true,
                },
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response?.data;
    } catch (error) {
        return null;
    }
}

export default scheduleZoomMeetingSession;