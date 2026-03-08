import dotenv from 'dotenv';

dotenv.config();

const app = Object.freeze({
    port: process.env.PORT || process.env.APP_PORT,
    origin: process.env.APP_ORIGIN || "",
    secretKey: process.env.APP_SECRET_KEY,
    mode: process.env.APP_MODE,
});
const client = Object.freeze({
    origin: process.env.CLIENT_ORIGIN,
});
const support = Object.freeze({
    email: process.env.SUPPORT_EMAIL,
    phone: process.env.SUPPORT_PHONE,
});
const db = Object.freeze({
    uri: process.env.DB_URI,
    url: process.env.DB_URL,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
});
const mail = Object.freeze({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
});
const zoom = Object.freeze({
    accountId: process.env.ZOOM_ACCOUNT_ID,
    clientId: process.env.ZOOM_CLIENT_ID,
    clientSecret: process.env.ZOOM_CLIENT_SECRET,
    sdkKey: process.env.ZOOM_SDK_KEY,
    sdkSecret: process.env.ZOOM_SDK_SECRET,
});
export default { app, client, support, db, mail, zoom };
