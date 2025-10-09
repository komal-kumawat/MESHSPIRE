import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/favicon.svg";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const Sidebar = () => {
  const [active, setActive] = useState("home");
  const [indicatorTop, setIndicatorTop] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = useNavigate();

//   // Determine screen width for expansion
  const [isExpanded, setIsExpanded] = useState(false); // md breakpoint

//   useEffect(() => {
//     const handleResize = () => {
//       setIsExpanded(window.innerWidth >= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

  const buttons = [
    { id: "home", icon: <HomeIcon />, label: "Home", path: "/dashboard" },
    { id: "chat", icon: <ChatIcon />, label: "Chat", path: "/dashboard/#chat" },
    { id: "calendar", icon: <CalendarTodayIcon />, label: "Calendar", path: "/dashboard/#calendar" },
    { id: "settings", icon: <SettingsIcon />, label: "Settings", path: "/dashboard/#settings" },
  ];

  useEffect(() => {
    const activeIndex = buttons.findIndex((btn) => btn.id === active);
    const btn = buttonsRef.current[activeIndex];
    if (btn) {
      const iconCenter = btn.offsetTop + btn.offsetHeight / 2;
      setIndicatorTop(iconCenter - 16); // 16 = half of indicator height (h-8)
    }
    setIsExpanded(false);
  }, [active]);

  const handleClick = (id: string, path: string) => {
    setActive(id);
    navigate(path);
  };

  return (
    <div
      className={`m-5 shadow-lg flex flex-col items-center py-4 gap-6 h-[95%] fixed bg-gray-900 rounded-xl transition-all duration-300
        ${isExpanded ? "w-48" : "w-16"}
      `}
    >
      {/* Logo */}
      <img src={logo} alt="Logo" className={`mb-4 transition-all ${isExpanded ? "w-24" : "w-10"}`} />

      <div className="relative w-full flex flex-col items-center">
        {/* Sliding Indicator */}
        <div
          className="absolute left-0 w-[4px] h-8 bg-white rounded-tr-md rounded-br-md transition-all duration-500"
          style={{ top: indicatorTop - 1 }}
        />

        {/* Buttons */}
        {buttons.map((btn, index) => (
          <button
            key={btn.id}
            ref={(el) => { buttonsRef.current[index] = el; }}
            onClick={() => handleClick(btn.id, btn.path)}
            className={`relative flex items-center w-full p-4 rounded-lg transition-all gap-3
              ${active === btn.id ? "bg-gray-700" : "bg-transparent"}
            `}
          >
            <span className="text-white">{btn.icon}</span>
            {isExpanded && <span className="text-white font-medium">{btn.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;