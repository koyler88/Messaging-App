import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
    const { user, token } = useAuth();

    // If no user or token, redirect to login
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}