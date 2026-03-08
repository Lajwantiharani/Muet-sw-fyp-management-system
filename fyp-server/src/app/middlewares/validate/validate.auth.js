import tryCatch from "../../../utils/libs/helper/try.catch.js";
import validator from "../../../utils/libs/validation/validator.js";

const signinForm = async (req, res, next) => tryCatch(async () => {
    // validate fields against rules
    const { errors, validationFailed } = await validator(req.body, {
        username: {
            required: true
        },
        password: {
            required: true
        }
    });

    // send response of validation failure
    if (validationFailed) {
        return res.response(422, "There was a validation failure", { errors });
    }

    next();
}, res);

const signupForm = (req, res, next) => tryCatch(async () => {
    // validate fields against rules
    const { errors, validationFailed } = await validator(req.body, {
        name: {
            required: true,
            string: true,
            min: 3,
            max: 50
        },
        email: {
            required: true,
            email: true,
            unique: { user: "email" }
        },
        phone: {
            phone: true,
            unique: { user: "phone" }
        },
        cnic: {
            required: true,
            number: true,
            digits: 13,
            unique: { user: "cnic" }
        },
        rollNo: {
            rollNo: true,
            unique: { user: "rollNo" }
        },
        department: {
            string: true,
            min: 2,
            max: 10
        },
        batch: {
            number: true,
            digits: 4,
        },
        shift: {
            in: ["morning", "evening"],
        },
        role: {
            in: ["supervisor", "student"]
        },
        password: {
            required: true,
            password: true
        },
    });

    // send response of validation failure
    if (validationFailed) {
        return res.response(422, "There was a validation failure", { errors });
    }

    next();
}, res);

const confirmAccount = async (req, res, next) => tryCatch(async () => {
    // validate fields against rules
    const { errors, validationFailed } = await validator(req.body, {
        token: {
            required: true,
        },
        email: {
            required: true,
            email: true,
        },
    });

    // send response of validation failure
    if (validationFailed) {
        return res.response(422, "There was a validation failure", { errors });
    }

    next();
}, res);

const requestResetPasswordLinkForm = async (req, res, next) => tryCatch(async () => {
    // validate fields against rules
    const { errors, validationFailed } = await validator(req.body, {
        email: {
            required: true,
            email: true,
            exists: { user: "email" }
        },
    });

    // send response of validation failure
    if (validationFailed) {
        return res.response(422, "There was a validation failure", { errors });
    }

    next();
}, res);

const resetPasswordForm = async (req, res, next) => tryCatch(async () => {
    // validate fields against rules
    const { errors, validationFailed } = await validator(req.body, {
        token: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            password: true
        },
        confirmationPassword: {
            required: true,
            same: { password: req.body.password }
        },
    });

    // send response of validation failure
    if (validationFailed) {
        return res.response(422, "There was a validation failure", { errors });
    }

    next();
}, res);

export default { signinForm, signupForm, confirmAccount, requestResetPasswordLinkForm, resetPasswordForm };