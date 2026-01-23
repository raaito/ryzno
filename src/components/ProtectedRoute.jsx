import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // Or a spinner

    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/academy" replace />;
    }

    return children;
};

export default ProtectedRoute;
