import mongoose from 'mongoose';
import crypto from 'crypto';
import env from '../../config/env.js';

const verificationTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['account-confirmation', 'reset-password'],
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
}, {
    timestamps: true,
    versionKey: false,
});

/**
 * Generate and store a unique verification token (for email confirmation or reset password).
 * Returns the verification link to send via email.
 */
verificationTokenSchema.statics.generateLink = async function (email, type, expiresAfterMinutes = 60) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresAfterMinutes * 60000);

    await this.deleteMany({ email });
    await this.create({ email, token, type, expiresAt });

    const baseUrl = `${env.client.origin}/${type}`;

    return `${baseUrl}?token=${token}&email=${encodeURIComponent(email)}`;
};

verificationTokenSchema.statics.verifyAndConsume = async function (token, type) {
    const record = await this.findOne({ token, type });

    if (!record) {
        return { status: 404, message: 'Invalid or expired link.' };
    }

    if (record.expiresAt < new Date()) {
        await record.deleteOne();
        return { status: 410, message: 'Link has expired. Please request a new one.' };
    }
    const { email } = record;
    await record.deleteOne();

    return { status: 200, email };
};

const Verification = mongoose.model('Verification', verificationTokenSchema);
export default Verification;
