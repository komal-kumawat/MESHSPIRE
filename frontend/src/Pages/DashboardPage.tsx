import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState("");

  const handleNewMeeting = () => {
    const id = uuidv4();
    navigate(`/room/${id}`);
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId.trim()) {
      navigate(`/room/${meetingId}`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-blue-600 text-white px-6 py-4 shadow flex justify-between">
        <h1 className="text-xl font-semibold">
          Hi, {user ? user.name : "Guest"}
        </h1>
      </nav>
      <main className="flex-1 p-6 bg-gray-50 flex flex-col items-center justify-center gap-6">
        <button
          onClick={handleNewMeeting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Start New Meeting
        </button>

        <form onSubmit={handleJoinMeeting} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Meeting ID"
            className="p-2 border rounded"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Join
          </button>
        </form>
      </main>
    </div>
  );
}
