import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }


  // If no token, redirect to signin page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
