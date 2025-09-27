import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-5xl font-bold mb-6">Welcome to MeshSpire</h1>
      <p className="text-gray-700 mb-8">Signin to start meeting</p>
      <div className="flex gap-4">
        <Link
          to="/signin"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
