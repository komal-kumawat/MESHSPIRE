import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const dashboardPath = role === "tutor" ? "/tutor-dashboard" : "/dashboard";
    setTimeout(() => navigate(dashboardPath), 3000);
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl border border-red-500/20 max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-6">✗</div>
        <h1 className="text-3xl font-bold text-red-400 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-400 mb-4">
          Your payment was cancelled. No charges were made.
        </p>
        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        <button
          onClick={() => {
            const dashboardPath =
              role === "tutor" ? "/tutor-dashboard" : "/dashboard";
            navigate(dashboardPath);
          }}
          className="mt-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 
                     transition-all px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
