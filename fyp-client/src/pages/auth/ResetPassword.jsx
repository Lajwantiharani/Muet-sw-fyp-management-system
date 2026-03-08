import { AuthContent, Button, Form, Input } from "@components";
import { resetPassword } from "@features";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@schemas";
import { Fragment, useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResestPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { loading } = useSelector((state) => state.auth);
    const [isPasswordSet, setIsPasswordSet] = useState(false);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleSetPassword = async (data) => {
        data.append("token", token);
        data.append("email", email);
        const result = await dispatch(resetPassword(data));
        if (resetPassword.fulfilled.match(result)) {
            setIsPasswordSet(true);
        }
    };

    useEffect(() => {
        if (!token || !email) navigate("/404", { replace: true });
    }, [token, email, navigate]);

    return (
        <AuthContent title="Set a new Password | FYP" description="Choose a new strong password for your account that you've not used before." className="md:w-[50%] lg:w-[35%]">
            {!isPasswordSet && (
                <Fragment>
                    <Form onSubmit={handleSetPassword} resolver={zodResolver(resetPasswordSchema)}>
                        <Input
                            type="password"
                            name="password"
                            label="New Password"
                            placeholder="Create a new password"
                        />
                        <Input
                            type="password"
                            name="confirmationPassword"
                            label="Confirm Password"
                            placeholder="Confirm your new password"
                        />

                        <Button type="submit" isLoading={loading} className="w-full mt-2">Save Password</Button>
                    </Form>

                    <div className="mt-4 text-center text-secondary">
                        Want to signin your account? <Button href="/signin" className="text-sm">Sign In</Button>
                    </div>
                </Fragment>
            )}

            {isPasswordSet && (
                <div className="rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6 text-center">
                    <div className="flex items-center gap-3 mb-4">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-2xl" />
                        <h2 className="text-green-600 dark:text-green-400 text-lg font-semibold m-0">
                            Password set Successfully
                        </h2>
                    </div>
                    <p className="text-sm text-secondary mb-4">
                        Your password has been successfully set. You can now sign in with your new password.
                    </p>
                    <Button href="/signin" className="flex items-center justify-center gap-2 w-full mt-2">
                        <FaArrowLeft /> Back to Sign In
                    </Button>
                </div>
            )}
        </AuthContent>
    )
}

export default ResestPassword;
