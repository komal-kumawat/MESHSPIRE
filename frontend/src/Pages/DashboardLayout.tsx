// src/Layout/DashboardLayout.tsx
"use client";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white w-full overflow-x-hidden m-0">
      <Sidebar onExpandChange={setIsSidebarExpanded} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "md:ml-60 w-full lg:w-[calc(100%-15rem)]" : "md:ml-20 w-full md:w-[calc(100%-5rem)]"
        }`}
      >
        <Navbar isSidebarExpanded={isSidebarExpanded} />

        <main className="overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
