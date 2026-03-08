import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import rules from '../../utils/libs/validation/rules.js';
import { messages } from '../../utils/libs/validation/messages.js';
import env from '../../config/env.js';

const MeetingSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    scheduledBy: {
        type: String,
        enum: ["admin", "supervisor", "student"],
        default: "admin",
    },
    title: {
        type: String,
        required: true
    },
    schedule: {
        type: Date,
        required: true,
        validate: {
            validator: v => rules.date(v, { futureDate: true }),
            message: messages.date.replace(':field', 'schedule')
        },
    },
    endsAt: {
        type: Date,
        required: true,
        validate: {
            validator: v => rules.date(v, { futureDate: true }),
            message: messages.date.replace(':field', 'ends at')
        },
    },
    duration: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        validate: {
            validator: v => !v || rules.url(v),
            message: messages.url.replace(':field', 'reference')
        },
        default: null,
    },
    summary: {
        type: String,
        required: true,
        validate: {
            validator: v => rules.word(v, { min: 5, max: 350 }),
            message: 'The meeting over must be between 5 and 350 words'
        },
    },

    /** zoom meeting session details */
    meetingId: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    startUrl: {
        type: String,
        required: true
    },
    joinUrl: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    encryptedPassword: {
        type: String
    },
    status: {
        type: String,
        enum: ['waiting', 'started', 'ended'],
        default: 'waiting'
    },

    // auto-delete meeting after 1 year
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        index: { expires: 0 },
        select: false,
    },
}, { timestamps: true, versionKey: false });

MeetingSchema.statics.schedule = function () {

}

MeetingSchema.statics.generateSignature = function ({ meetingId, role = 0 }) {
    const sdkKey = env.zoom.sdkKey;
    const sdkSecret = env.zoom.sdkSecret;

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 2;

    const payload = {
        appKey: sdkKey,
        mn: meetingId,
        role,
        iat,
        exp,
        tokenExp: exp,
        video_webrtc_mode: 1
    };

    return jwt.sign(payload, sdkSecret, { algorithm: 'HS256' });
};



const Meeting = mongoose.model('Meeting', MeetingSchema);
export default Meeting;
