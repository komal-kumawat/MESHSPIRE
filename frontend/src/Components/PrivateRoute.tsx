import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("student" | "tutor")[];
}

interface DecodedToken {
  exp: number; // JWT expiration timestamp
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { token, loading, logout, role } = useAuth();
  const [isExpired, setIsExpired] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000; // in seconds

        if (decoded.exp && decoded.exp < currentTime) {
          setIsExpired(true);
          logout(); // clear token from localStorage
        }
      } catch (err) {
        console.error("Invalid token:", err);
        setIsExpired(true);
        logout();
      }
    }
  }, [token, logout]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  if (!token || isExpired) {
    return <Navigate to="/" replace />;
  }

  // Role-based gating
  if (allowedRoles && allowedRoles.length > 0) {
    // If role not yet determined, show loading safeguard
    if (role === "") {
      return <div className="text-center mt-10 text-gray-500">Loading...</div>;
    }
    if (!allowedRoles.includes(role)) {
      // Redirect to the user's own dashboard if trying to access the other one
      const target = role === "tutor" ? "/tutor-dashboard" : "/dashboard";
      if (location.pathname !== target) {
        return <Navigate to={target} replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
