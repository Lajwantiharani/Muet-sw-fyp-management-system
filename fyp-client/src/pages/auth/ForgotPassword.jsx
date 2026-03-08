import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContent, Button, Form, Input } from "@components";
import { requestResetPasswordSchema } from "@schemas";
import { useDispatch, useSelector } from "react-redux";
import { requestResetPassword } from "@features";
import { Fragment, useState } from "react";
import { FaArrowLeft, FaBackspace, FaBackward, FaCheck, FaCheckCircle } from "react-icons/fa";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [isLinkSent, setIsLinkSent] = useState(false);
    const { loading } = useSelector((state) => state.auth);

    const handleSendOtp = async (data) => {
        const result = await dispatch(requestResetPassword(data));
        if (requestResetPassword.fulfilled.match(result)) {
            setIsLinkSent(true);
        }
    };

    return (
        <AuthContent title="Forgot Password | FYP" description="Enter email address associated with you account" className="md:w-[50%%] lg:w-[35%]">
            {!isLinkSent && (
                <Fragment>
                    <Form onSubmit={handleSendOtp} resolver={zodResolver(requestResetPasswordSchema)}>
                        <Input label="Email Address" name="email" placeholder="Enter your account email" />
                        <Button type="submit" isLoading={loading} className="w-full mt-2">Send Reset Password Link</Button>
                    </Form>

                    <div className="mt-4 text-center text-secondary">
                        Remember account password? <Button href="/signin" className="text-sm">Sign In</Button>
                    </div>
                </Fragment>
            )}

            {isLinkSent && (
                <div className="rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-2xl" />
                        <h2 className="text-green-600 dark:text-green-400 text-lg font-semibold m-0">
                           Password Reset Link Sent!
                        </h2>
                    </div>
                    <p className="text-sm text-secondary mb-4">
                        Please check your email for the reset password link.
                        If you don’t see it in your inbox, check your spam folder.
                    </p>
                    <Button href="/signin" className="flex items-center justify-center gap-2 w-full mt-2">
                        <FaArrowLeft /> Back to Sign In
                    </Button>
                </div>
            )}
        </AuthContent>
    )
};

export default ForgotPassword;
