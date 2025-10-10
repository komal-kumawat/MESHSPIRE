import React from "react";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import MeetComp from "../Component/MeetComp";

interface Meeting {
  id: number;
  theoremName: string;
  teacherName: string;
}

const Dashboard: React.FC = () => {
  // Array of meetings
  const meetings: Meeting[] = [
    { id: 1, theoremName: "Pythagoras Theorem", teacherName: "Mr. Sharma" },
    { id: 2, theoremName: "Fermat's Last Theorem", teacherName: "Ms. Gupta" },
    { id: 3, theoremName: "Euler's Formula", teacherName: "Dr. Mehta" },
    { id: 4, theoremName: "Binomial Theorem", teacherName: "Mr. Singh" },
    { id: 5, theoremName: "Taylor Series", teacherName: "Ms. Verma" },
    { id: 6, theoremName: "Lagrange Multipliers", teacherName: "Dr. Kapoor" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex flex-1">
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1 ml-10 md:ml-10">
          <Navbar />

          <div className="px-4 sm:px-6 lg:px-10 py-8 flex flex-col items-center py-20 pl-10">
            {/* Optional Title */}
            <h1 className="text-5xl font-bold text-white py-5">
              Welcome to MeshSpire
            </h1>

            {/* Grid layout for MeetComp */}
            <div className="grid grid-cols-1  lg:grid-cols-3 gap-6 w-full max-w-[1200px] ">
              {meetings.map((meeting) => (
                <MeetComp
                  key={meeting.id}
                  theoremName={meeting.theoremName}
                  teacherName={meeting.teacherName}
                  onJoin={() =>
                    console.log(`Joining ${meeting.theoremName}...`)
                  }
                  onDetails={() =>
                    console.log(`Showing details of ${meeting.theoremName}...`)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
