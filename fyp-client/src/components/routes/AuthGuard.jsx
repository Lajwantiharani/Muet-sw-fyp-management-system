import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks";

const AuthGuard = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
