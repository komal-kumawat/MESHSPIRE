import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-md shadow-xl px-6 py-4 flex items-center justify-between">
      {/* Left: Greeting */}
      <div
        className="text-white font-semibold text-lg hover:text-cyan-400 transition-colors cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        {username ? `Hello, ${username}` : "Hello, Guest"}
      </div>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-xl hover:scale-105 transition-all duration-200  text-white font-semibold text-sm"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
