import { Router } from 'express'

import authController from '../app/controllers/auth.controller.js';
import validateAuth from '../app/middlewares/validate/validate.auth.js';
import auth from "../app/middlewares/auth.js";
import file from '../app/middlewares/file.js';
import form from '../app/middlewares/form.js';

const authRoutes = Router({ mergeParams: true });

// route to sign in user
authRoutes.post('/signin',
    file.none, // enable route to access request body fields
    form.sanitize, // middleware to sanitize input fields
    validateAuth.signinForm, // middleware to enforce certain validations on input fields
    authController.signin  // validate user signin attempt
);

// route to register an account 
authRoutes.post('/signup',
    file.none, //enable route to access request body fields
    form.sanitize, // middleware to sanitize input fields
    validateAuth.signupForm, // middleware to enforce certain validations on input fields
    authController.signup // perform user registration
);

// route to confirm account email
authRoutes.post('/confirm-account',
    file.none, // enable route to access request body fields
    form.sanitize, // middleware to sanitize input fields
    validateAuth.confirmAccount, // middleware to enforce certain validations on input fields
    authController.confirmAccount // perform account confirmation
);

// route to request reset password link
authRoutes.post('/request-reset-password',
    file.none, // enable route to access request body fields
    form.sanitize,  // middleware to sanitize input fields
    validateAuth.requestResetPasswordLinkForm, // middleware to enforce certain validations on input fields
    authController.requestResetPasswordLink // sent rest password link
);

// route to reset forgotten password
authRoutes.patch('/reset-password',
    file.none,// enable route to access request body fields 
    form.sanitize,  // middleware to sanitize input fields
    validateAuth.resetPasswordForm, // middleware to enforce certain validations on input fields
    authController.resetPassword // perform reseting password
);

// route to verify token
authRoutes.get('/verify-token',
    auth.authenticate, // middleware to authenticate request user based on JWT token
    auth.authorize("*"), // middleware to allow specified role(s) only 
    authController.verifyToken // controller method to handle verify token logic
);

export default authRoutes;