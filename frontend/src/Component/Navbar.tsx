import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

const Navbar: React.FC = () => {
  const { username, logout, userId } = useAuth();
  const [userDropDown, setUserDropDown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md px-8 py-4 flex items-center justify-between ml-[100px] md:mr-[100px]">
      <div
        className="text-white font-extrabold text-2xl hover:text-cyan-400 transition-colors cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        {username
          ? `Hello, ${username.charAt(0).toUpperCase() + username.slice(1)}`
          : "Hello, Guest"}
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative hidden lg:flex items-center ">
          <input
            type="text"
            placeholder="Search..."
            className="w-80 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute right-3 text-gray-400 cursor-pointer" />
        </div>

        <div className="relative cursor-pointer">
          <NotificationsIcon className="text-gray-300 hover:text-cyan-400 transition-colors" />
        </div>

        <div className="relative" ref={dropdownRef}>
          <AccountCircleIcon
            fontSize="large"
            className="text-gray-300 cursor-pointer"
            onClick={() => setUserDropDown(!userDropDown)}
          />

          {userDropDown && (
            <div className="absolute right-0 mt-3 w-40 bg-gray-800 text-white rounded-xl shadow-lg border border-gray-700 z-50">
              <div className="px-4 py-2 border-b border-gray-700">
                {username
                  ? `Hello, ${
                      username.charAt(0).toUpperCase() + username.slice(1)
                    }`
                  : "Hello, Guest"}
              </div>
              <div
                className="px-4 py-2 border-b border-gray-700 cursor-pointer "
                onClick={() => navigate(`/profile/${userId}`)}
              >
                Profile
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition-colors rounded-b-xl"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
