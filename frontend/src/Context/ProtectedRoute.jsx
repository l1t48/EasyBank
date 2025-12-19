import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth-page" replace />;
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.accountType))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute
