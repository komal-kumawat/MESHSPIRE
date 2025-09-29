import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white gap-6">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

            <button
                onClick={startMeeting}
                className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition font-semibold"
            >
                Start Meeting
            </button>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="px-4 py-2 rounded-xl text-white bg-gray-700 placeholder-gray-400"
                />

                <button
                    onClick={joinMeeting}
                    className="px-4 py-2 bg-green-600 rounded-xl hover:bg-green-500 transition font-semibold"
                >
                    Join
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
