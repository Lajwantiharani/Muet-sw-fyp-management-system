import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "@features";
import { useNavigate, useParams } from "react-router-dom";

const Signout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.auth.token);
    const { token } = useParams();

    useEffect(() => {
        if (!token || token != accessToken) {
            navigate("/404", { replace: true })
        };

        const timeout = setTimeout(async () => {
            dispatch(signout());
            navigate("/signin", { replace: true });
        }, 1000);

        return () => clearTimeout(timeout);
    }, [token, accessToken, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary text-text-primary px-4">
            <div className="p-6 w-full max-w-sm text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <svg
                        className="w-6 h-6 animate-spin text-theme"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-theme">Signing you out...</h2>
                <p className="text-sm text-secondary mt-2">
                    Please wait, you’ll be redirected shortly.
                </p>
            </div>
        </div>
    );
};

export default Signout;
