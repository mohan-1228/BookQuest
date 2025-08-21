import React from "react";
import { useAuth } from "../../context/authContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in (e.g., check for a token in localStorage)
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("userToken");

  if (!token || !user) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child component (the requested page)
  return children;
};

export default ProtectedRoute;
