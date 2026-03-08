import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContent, Button, Form, Input } from "@components";
import { signinSchema } from "@schemas";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "@features";
import { FaExclamationCircle } from "react-icons/fa";

const Signin = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const handleSignin = async (data) => {
        dispatch(signin(data));
    };

    return (
        <AuthContent
            title="Sign In | FYP"
            description="Welcome back! Please enter your credentials to continue"
            className="md:w-[50%] lg:w-[30%]"
        >
            <Form
                onSubmit={handleSignin}
                resolver={zodResolver(signinSchema)}
                className="relative"
            >
                <Input
                    name="username"
                    label="Username"
                    placeholder="Enter your username"
                    autoComplete="username"

                    addOn={
                        <div className="relative right-0 group">
                            <FaExclamationCircle className="mr-1 text-secondary group-hover:text-theme cursor-pointer transition-colors duration-200" />

                            <div
                                className={`
                                    absolute bottom-full mb-2
                                    right-0
                                    w-[60vw] sm:w-64
                                    bg-primary border border-primary shadow-xl rounded-lg
                                    px-4 py-2 text-sm text-secondary text-left
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                    pointer-events-none z-30
                                `}
                            >
                                <div className="font-semibold text-primary mb-1">Username Info</div>
                                <p className="text-sm sm:text-xs text-secondary leading-relaxed">
                                    Your username can be your <span className="text-link font-medium">Email</span>, <span className="text-link font-medium">Roll No.</span>, <span className="text-link font-medium">CNIC</span> (without dashes), or <span className="text-link font-medium">Phone No.</span> (without +92 or 0).
                                </p>
                            </div>
                        </div>
                    }

                />

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"

                    addOn={<div className="text-right">
                        <Button href="/forgot-password" className="text-sm">
                            Forgot Password?
                        </Button>
                    </div>}
                    autoComplete="password"
                />

                <Button type="submit" isLoading={loading} className="w-full mt-2">
                    Sign In
                </Button>
            </Form>

            <div className="mt-4 text-center text-secondary">
                Don't have an account? <Button href="/signup" className="text-sm">
                    Sign Up
                </Button>
            </div>
        </AuthContent>
    );
};

export default Signin;
