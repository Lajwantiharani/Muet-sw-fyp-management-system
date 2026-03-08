import filterRequestBody from "../../utils/libs/helper/filter.request.body.js";
import notificationService from "../services/notification.service.js"
import tryCatch from '../../utils/libs/helper/try.catch.js';
import Verification from '../models/verification.model.js';
import userService from "../services/user.service.js";
import email from '../../utils/libs/helper/email.js';

// SIGIN FOR SUPERVISOR AND STUDENT
const signin = (req, res) => tryCatch(async () => {
    // destructure request body
    const { username, password } = req.body;

    // construct query to match any user
    const query = { $or: [{ email: username }, { phone: username }, { cnic: username }, { rollNo: username }] }

    // retrieve user by phone|email|nic|rollNo 
    let user = await userService.retrieveOne(query, { withPassword: true });

    // return back with access denied response whether user is not found or password is invalid
    if (!user || !(await user.comparePassword(password))) {
        // push notification 
        notificationService.push({
            title: "Sign-in attempt detected",
            message: `There was a failed attempt to sign in to your account on ${new Date().toLocaleString()}.`,
        }, user?._id ?? null);

        return res.response(403, "Invalid username or password");
    }

    // return back with access denied response if user status is not active
    if (user.status != "active") {
        return res.response(403, "Account is not active");
    }

    // generate jwt token with user ID payload, expiring in 7 days
    const token = user.generateToken("7d");

    // return back with success response containing user and token
    return res.response(200, "Signin successfully", { user, token });
}, res);

// SIGNUP FOR SUPERVISOR AND STUDENT
const signup = (req, res) => tryCatch(async () => {
    // only fields that are allowed to be inserted
    const allowedFields = ["name", "email", "phone", "cnic", "rollNo", "department", "batch", "shift", "role", "password"];

    // extacting only allowed fields from request body
    const data = filterRequestBody(req.body, allowedFields);

    // attempt to create a new user; throw registration failed error if unsuccessful
    if (!await userService.create(data)) throw new Error("The signup was failed");

    // generate reset password link
    const emailConfirmationLink = await Verification.generateLink(data.email, 'account-confirmation', 60 * 24 * 7);

    // configure and send confirmation email
    const isEmailSent = await email.send(data.email, {
        subject: "Confirm Your FYP Account",
        name: data.name.capEach(),
        confirmLink: emailConfirmationLink,
        template: "confirm-email",
    });

    // send email with reset password link and check if it was sent othwerwise throw failed to send email error
    if (!isEmailSent) throw new Error("Failed to send confirmation email");

    // push notification
    notificationService.push({
        title: `New ${data.role == 'student' ? 'Student' : 'Supervisor'} Signup`,
        message: `${data?.name || 'A new user'} has signed up as a ${data.role}. Please review and approve their account.`,
    }, "admins");

    // return back with success response
    return res.response(200, "Account confirmtion email sent", { email: data.email });
}, res);

// CONFIRM EMAIL
const confirmAccount = (req, res) => tryCatch(async () => {
    const { email, token } = req.body;

    // verify token and match email
    const result = await Verification.verifyAndConsume(token, 'account-confirmation');

    if (result?.status != 200 || result?.email != email) {
        return res.response(result?.status ?? 400, "Invalid or expired confirmation link");
    }

    // mark account as verified
    const user = await userService.update(
        { email },
        {
            status: 'approvalPending',
            verifiedAt: new Date(),
        }
    );

    // push notification
    notificationService.push({
        title: `Account Verified by ${user.role.cap()}`,
        message: `${user.name} (${user.email}) has verified their email and completed signup as a ${user.role}. Please review and approve their account.`,
    }, "admins");


    // return back with success response
    return res.response(200, "Your account has been successfully confirmed.");
}, res);

// REQUEST RESET PASSWORD
const requestResetPasswordLink = (req, res) => tryCatch(async () => {
    // destructure request body
    const { email: resetPasswordEmail } = req.body;

    // retrieve user to check whether it exists or not
    const user = await userService.retrieveOne({ email: resetPasswordEmail });
    if (!user) return res.response(404, "There is not any account associated with this email");

    // generate reset password link
    const resetPasswordLink = await Verification.generateLink(resetPasswordEmail, 'reset-password')

    // configure and sent reset password email
    const isEmailSent = await email.send(resetPasswordEmail, {
        subject: "Reset Password Request",
        name: user.name.capEach(),
        resetLink: resetPasswordLink,
        template: "reset-password",
    });

    // send email with reset password link and check if it was sent othwerwise throw failed to send email error
    if (!isEmailSent) throw new Error("Failed to send reset password email");

    // push notification
    notificationService.push({
        title: "Password reset requested",
        message: `A password reset link was requested for your account on ${new Date().toLocaleString()}. If this wasn't you, please secure your account.`,
    }, user?._id);

    // return back with success response
    return res.response(200, "Reset password email sent");
}, res);

// RESET PASSWORD
const resetPassword = (req, res) => tryCatch(async () => {
    // destructure request body
    const { email: resetPasswordEmail, password, token } = req.body;

    // validate whether token is valid and email matches
    const result = await Verification.verifyAndConsume(token, 'reset-password');

    // return back with error response if token is invalid or expired
    if (result?.status != 200 || result?.email != resetPasswordEmail) {
        return res.response(404, "Invalid or expired reset password link");
    }

    // retrieve user by email and update password
    const user = await userService.update({ email: resetPasswordEmail }, { password });

    // push noification
    notificationService.push({
        title: "Your password was reset",
        message: "You have successfully reset your password. If this wasn’t you, please contact support immediately.",
    }, user._id);

    // return back with success response
    return res.response(200, "Password reset successfully");
}, res);

// VERIFY TOKEN
const verifyToken = (req, res) => tryCatch(async () => (
    res.response(200, "Token verified", { user: req.user })
), res);

export default { signin, signup, confirmAccount, requestResetPasswordLink, resetPassword, verifyToken }