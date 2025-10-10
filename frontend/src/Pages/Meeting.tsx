"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🧩 Import your existing layout components
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const Meeting: React.FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>("");
  const [roomURL, setRoomURL] = useState<string>("");

  // Start a new meeting
  const startMeeting = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const url = `${window.location.origin}/room/${randomId}`;
    setRoomId(randomId);
    setRoomURL(url);
    navigate(`/room/${randomId}`);
  };

  // Join existing meeting
  const joinMeeting = () => {
    if (roomId.trim() !== "") {
      navigate(`/room/${roomId}`);
    } else {
      alert("Please enter a Room ID");
    }
  };

  const copyURL = () => {
    if (roomURL) navigator.clipboard.writeText(roomURL);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <Navbar isSidebarExpanded={true} />

      <div className="flex flex-1">
        <main className="flex-1 overflow-y-auto p-10 lg:p-12 bg-gray-950">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full text-center space-y-10">
            <div>
              <h1 className="text-3xl  text-white mb-4"></h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Start a new meeting instantly or join an existing one using a
                Room ID.
              </p>
            </div>

            <div>
              <button
                onClick={startMeeting}
                className="px-8 py-4 bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 
                hover:from-violet-800 hover:to-violet-700 transition-all duration-300 
                rounded-2xl font-semibold shadow-lg text-lg"
              >
                Start Meeting
              </button>
            </div>

            {/* Show Room URL */}
            {roomURL && (
              <div className="mt-4 flex flex-col items-center gap-3 bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-lg">
                <p className="text-green-400 text-lg font-medium">
                  Share this link to invite others:
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={roomURL}
                    readOnly
                    className="px-4 py-2 rounded-xl text-white bg-gray-800 border border-gray-700 w-80 text-center focus:outline-none"
                  />
                  <button
                    onClick={copyURL}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 
                    hover:from-green-500 hover:to-green-400 transition-all duration-300 rounded-xl font-semibold"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            {/* Join Meeting */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRoomId(e.target.value)
                }
                className="px-4 py-3 rounded-2xl text-white bg-slate-900/70 border border-white/10 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700 w-full sm:w-64"
              />
              <button
                onClick={joinMeeting}
                className="px-8 py-3 bg-gradient-to-r from-green-700 via-green-600 to-green-700 
                hover:from-green-600 hover:to-green-500 transition-all duration-300 
                rounded-2xl font-semibold shadow-lg w-full sm:w-auto"
              >
                Join Meeting
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Meeting;
