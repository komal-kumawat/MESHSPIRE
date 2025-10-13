// src/Layout/DashboardLayout.tsx
"use client";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white  m-0">
      <Sidebar onExpandChange={setIsSidebarExpanded} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? "md:ml-60" : "md:ml-20"
        }`}
      >
        <Navbar isSidebarExpanded={isSidebarExpanded} />

        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
