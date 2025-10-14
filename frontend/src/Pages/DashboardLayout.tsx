// src/Layout/DashboardLayout.tsx
"use client";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white w-full overflow-x-hidden  m-0">
      <Sidebar onExpandChange={setIsSidebarExpanded} />

      <div
        className={`flex-1 transition-all duration-300    ${
          isSidebarExpanded ? "md:ml-60 w-[70%]" : "md:ml-20 w-[100%] md:w-[90%]"
        }`}
      >
        <Navbar isSidebarExpanded={isSidebarExpanded} />

        <main >
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
