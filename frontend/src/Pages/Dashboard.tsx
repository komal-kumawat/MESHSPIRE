import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [roomURL, setRoomURL] = useState("");

  // Start a new meeting
  const startMeeting = () => {
    const randomId = Math.random().toString(36).substring(2, 10); // 8 chars
    const url = `${window.location.origin}/room/${randomId}`; // generate full URL
    setRoomId(randomId);
    setRoomURL(url); // store shareable link
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

  // Copy URL to clipboard
  const copyURL = () => {
    if (roomURL) navigator.clipboard.writeText(roomURL);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col flex-1 ml-10">
          <Navbar />
          <div className="flex flex-col items-center justify-center flex-1 gap-10 px-6 py-12 text-center">
            <h1 className="text-5xl font-bold">Welcome to MeshSpire</h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Start a new meeting instantly or join an existing one using a Room ID.
            </p>

            <button
              onClick={startMeeting}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 transition-all rounded-2xl font-semibold shadow-lg text-lg"
            >
              Start Meeting
            </button>

            {roomURL && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-green-400">Share this link to invite others:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roomURL}
                    readOnly
                    className="px-4 py-2 rounded-xl text-black w-72"
                  />
                  <button
                    onClick={copyURL}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

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
