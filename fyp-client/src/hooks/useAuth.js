import { useSelector } from "react-redux";

const useAuth = () => {
    const { user, token } = useSelector(state => state.auth);

    return {
        isAuthenticated: !!token,
        user, token, role: user?.role
    }
}
export default useAuth;