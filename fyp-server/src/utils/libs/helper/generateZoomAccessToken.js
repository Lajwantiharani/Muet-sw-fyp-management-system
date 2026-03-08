import axios from "axios";
import env from "../../../config/env.js";

const generateZoomAccessToken = async () => {
    const { accountId, clientId, clientSecret } = env.zoom;

    try {
        const response = await axios.post(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
            {},
            { headers: { Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"), } }
        );

        return response.data.access_token;
    } catch (error) {
        return null
    }
};

export default generateZoomAccessToken;
