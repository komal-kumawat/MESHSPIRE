import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-lg mb-6 max-w-lg text-center">
          The page you are looking for doesn’t exist or has been moved. Please
          check the URL or return to the dashboard.
        </p>

        <Link
          to="/dashboard"
          className="px-8 py-4 bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 
          hover:from-violet-800 hover:to-violet-700 transition-all duration-300 
          rounded-2xl font-semibold shadow-lg text-lg"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
