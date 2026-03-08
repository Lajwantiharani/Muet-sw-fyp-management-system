import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-[85vh] bg-primary sm:bg-secondary sm:min-h-screen flex flex-col items-center justify-center sm:text-sm">
            <Outlet />
        </div>
    );
}

export default AuthLayout;