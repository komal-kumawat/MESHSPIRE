import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome to MeshSpire</h1>

      <div className="flex gap-6">
        <Link
          to="/signup"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition font-semibold shadow-lg"
        >
          Sign Up
        </Link>

        <Link
          to="/signin"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition font-semibold shadow-lg"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
