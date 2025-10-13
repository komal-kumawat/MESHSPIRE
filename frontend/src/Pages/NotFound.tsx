import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-3 sm:mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-md sm:max-w-lg md:max-w-xl">
          The page you are looking for doesn’t exist or has been moved. Please
          check the URL or return to the dashboard.
        </p>

        <Link
          to="/dashboard"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 
          hover:from-violet-800 hover:to-violet-700 transition-all duration-300 
          rounded-2xl font-semibold shadow-lg text-base sm:text-lg"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;