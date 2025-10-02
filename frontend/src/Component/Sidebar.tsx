import { useState, useRef, useEffect } from "react";
import logo from "../assets/favicon.svg";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const Sidebar = () => {
    const [active, setActive] = useState("home");
    const [indicatorTop, setIndicatorTop] = useState(0);
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const buttons = [
        { id: "home", icon: <HomeIcon className="text-white" /> },
        { id: "chat", icon: <ChatIcon className="text-white" /> },
        { id: "calendar", icon: <CalendarTodayIcon className="text-white" /> },
        { id: "settings", icon: <SettingsIcon className="text-white" /> },
    ];

    useEffect(() => {
        const activeIndex = buttons.findIndex((btn) => btn.id === active);
        const btn = buttonsRef.current[activeIndex];
        if (btn) {
            const iconCenter = btn.offsetTop + btn.offsetHeight / 2;
            setIndicatorTop(iconCenter - 16); // 16 = half of indicator height (h-8)
        }
    }, [active]);

    return (
        <div className="m-5  shadow-lg flex flex-col items-center w-16 bg-gray-900 rounded-xl py-4 gap-6 h-[95%] fixed">
            {/* Logo */}
            <img src={logo} alt="Logo" width={40} className="mb-4" />

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
                        ref={(el) => { buttonsRef.current[index] = el }}
                        onClick={() => setActive(btn.id)}
                        className={`relative w-full flex items-center justify-center p-4 rounded-lg transition-all `}
                    >
                        {btn.icon}
                    </button>
                ))}

            </div>
        </div>
    );
};

export default Sidebar;
