import React, { useState } from "react";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import MeetComp from "../Component/MeetComp";

interface Meeting {
  id: number;
  theoremName: string;
  teacherName: string;
}

const Dashboard: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const meetings: Meeting[] = [
    { id: 1, theoremName: "Pythagoras Theorem", teacherName: "Mr. Sharma" },
    { id: 2, theoremName: "Fermat's Last Theorem", teacherName: "Ms. Gupta" },
    { id: 3, theoremName: "Euler's Formula", teacherName: "Dr. Mehta" },
    { id: 4, theoremName: "Binomial Theorem", teacherName: "Mr. Singh" },
    { id: 5, theoremName: "Taylor Series", teacherName: "Ms. Verma" },
    { id: 6, theoremName: "Lagrange Multipliers", teacherName: "Dr. Kapoor" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar onExpandChange={setIsSidebarExpanded} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "ml-56" : "ml-20"
        }`}
      >
        <Navbar isSidebarExpanded={isSidebarExpanded} />

        <main className="px-6 lg:px-10 py-10 transition-all duration-300">
          <h1 className="text-5xl font-bold text-white mb-10 text-center">
            Welcome to MeshSpire
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {meetings.map((meeting) => (
              <MeetComp
                key={meeting.id}
                theoremName={meeting.theoremName}
                teacherName={meeting.teacherName}
                onJoin={() => console.log(`Joining ${meeting.theoremName}...`)}
                onDetails={() =>
                  console.log(`Details of ${meeting.theoremName}...`)
                }
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
