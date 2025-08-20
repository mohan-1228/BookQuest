import React from "react";
import { useAuth } from "../../context/authContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
