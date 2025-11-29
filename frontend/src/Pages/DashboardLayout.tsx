// src/Layout/DashboardLayout.tsx
"use client";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-black text-white w-full overflow-hidden m-0">
      <Sidebar onExpandChange={setIsSidebarExpanded} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 h-screen ${
          isSidebarExpanded
            ? "md:ml-60 w-full lg:w-[calc(100%-15rem)]"
            : "md:ml-20 w-full md:w-[calc(100%-5rem)]"
        }`}
      >
        <Navbar isSidebarExpanded={isSidebarExpanded} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
