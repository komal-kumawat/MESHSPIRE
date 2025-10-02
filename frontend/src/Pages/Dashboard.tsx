import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  // Generate random room ID
  const startMeeting = () => {
    const randomId = Math.random().toString(36).substring(2, 10); // 8 chars
    navigate(`/room/${randomId}`);
  };

  // Join existing room
  const joinMeeting = () => {
    if (roomId.trim() !== "") {
      navigate(`/room/${roomId}`);
    } else {
      alert("Please enter a Room ID");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main area */}
        <div className="flex flex-col flex-1 ml-10">
          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <div className="flex flex-col items-center justify-center flex-1 gap-10 px-6 py-12 text-center">
            <h1 className="text-5xl font-bold">Welcome to MeshSpire</h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Start a new meeting instantly or join an existing one using a Room ID.
            </p>

            {/* Start Meeting Button */}
            <button
              onClick={startMeeting}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 transition-all rounded-2xl font-semibold shadow-lg text-lg"
            >
              Start Meeting
            </button>

            {/* Join Meeting */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-6">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="px-4 py-3 rounded-2xl text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
              <button
                onClick={joinMeeting}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 transition-all rounded-2xl font-semibold shadow-lg w-full sm:w-auto"
              >
                Join Meeting
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
