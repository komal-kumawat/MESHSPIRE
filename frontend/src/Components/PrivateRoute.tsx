import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {jwtDecode} from "jwt-decode";

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number; // JWT expiration timestamp
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token, loading, logout } = useAuth();
  const [isExpired, setIsExpired] = useState(false);

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

  return <>{children}</>;
};

export default ProtectedRoute;
