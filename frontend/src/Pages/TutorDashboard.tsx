import { useAuth } from "../Context/AuthContext";

const TutorDashboard = () => {
  const { username } = useAuth();
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Tutor Dashboard</h1>
      <p className="mb-6">
        Welcome {username || "Tutor"}! This is a placeholder dashboard for
        tutors. Build tutor-specific analytics, class management, and scheduling
        features here.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h2 className="font-semibold mb-2">Your Classes</h2>
          <p className="text-sm text-gray-300">
            No classes yet. Start by creating one.
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h2 className="font-semibold mb-2">Students</h2>
          <p className="text-sm text-gray-300">
            Student metrics will appear here.
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h2 className="font-semibold mb-2">Upcoming Sessions</h2>
          <p className="text-sm text-gray-300">
            Schedule management to be implemented.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
