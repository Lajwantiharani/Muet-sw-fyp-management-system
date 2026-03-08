import { AuthContent, Button } from "@components";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import clsx from "clsx";

const ConfirmAccount = () => {
    const { isConfirmed } = useLoaderData();

    return (
        <AuthContent
            title="Account Confirmation | FYP"
            description="Your email address has been processed"
            className="md:w-[90%] lg:w-[35%]"
        >
            <div
                className={clsx(
                    "rounded-lg p-6 shadow-sm border transition-all",
                    isConfirmed
                        ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                        : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                )}
            >
                <div className="flex items-center gap-3 mb-4">
                    {isConfirmed ? (
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-2xl" />
                    ) : (
                        <FaTimesCircle className="text-red-600 dark:text-red-400 text-2xl" />
                    )}
                    <h2 className={clsx("text-lg font-semibold m-0", {
                        "text-green-600 dark:text-green-400": isConfirmed,
                        "text-red-600 dark:text-red-400": !isConfirmed
                    })}>
                        {isConfirmed ? "Confirmation Successful" : "Confirmation Failed"}
                    </h2>
                </div>

                <p className="text-sm text-secondary mb-4">
                    {isConfirmed
                        ? "Thank you for confirming your account! You can now sign in and begin using the platform."
                        : "Oops! We couldn’t confirm your account. Please retry the confirmation link or contact support if the issue persists."}
                </p>

                {isConfirmed && (
                    <Button href="/signin" className="flex items-center justify-center gap-2 w-full mt-2">
                        Sign In
                    </Button>
                )}
            </div>
        </AuthContent>
    );
};

export default ConfirmAccount;
