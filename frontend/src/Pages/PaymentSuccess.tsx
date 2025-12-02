import API from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const session_id = params.get("session_id");
  const navigate = useNavigate();
  const { role } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    if (!session_id) {
      setStatus("error");
      const dashboardPath =
        role === "tutor" ? "/tutor-dashboard" : "/dashboard";
      setTimeout(() => navigate(dashboardPath), 3000);
      return;
    }

    // Verify payment
    API.get(`/payment/verify?session_id=${session_id}`)
      .then((res) => {
        console.log("Payment verified:", res.data);
        setStatus("success");
        const dashboardPath =
          role === "tutor" ? "/tutor-dashboard" : "/dashboard";
        setTimeout(() => navigate(dashboardPath), 2000);
      })
      .catch((err) => {
        console.error("Payment verification error:", err);
        setStatus("error");
        const dashboardPath =
          role === "tutor" ? "/tutor-dashboard" : "/dashboard";
        setTimeout(() => navigate(dashboardPath), 3000);
      });
  }, [session_id, navigate, role]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl border border-violet-500/20 max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-500 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-violet-400 mb-2">
              Verifying Payment...
            </h1>
            <p className="text-gray-400">
              Please wait while we confirm your payment
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-6xl mb-6">✓</div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-gray-400 mb-4">
              Your lesson has been confirmed and paid.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-6xl mb-6">✗</div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-400 mb-4">
              Unable to verify payment. Please contact support if amount was
              deducted.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}
