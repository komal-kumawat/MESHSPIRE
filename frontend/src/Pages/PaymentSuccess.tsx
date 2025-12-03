import API from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const session_id = params.get("session_id");
  const navigate = useNavigate();
  const { role, token, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "auth_expired"
  >("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      console.log("Waiting for auth to load...");
      return;
    }

    console.log("PaymentSuccess mounted:", {
      session_id,
      hasToken: !!token,
      role,
      authLoading,
      fullURL: window.location.href,
      origin: window.location.origin,
    });

    if (!session_id) {
      console.error("No session_id found in URL");
      setStatus("error");
      setErrorMessage("No payment session ID found in the URL.");
      const dashboardPath =
        role === "tutor" ? "/tutor-dashboard" : "/dashboard";
      setTimeout(() => navigate(dashboardPath), 3000);
      return;
    }

    // Check if user is still authenticated
    if (!token) {
      console.error("No authentication token found");
      setStatus("auth_expired");
      setErrorMessage(
        "Your session expired. Please sign in again to complete payment verification."
      );
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    // Verify payment with retry logic
    const verifyPayment = async (attempt = 1) => {
      try {
        console.log(`Verifying payment (attempt ${attempt})...`);
        const res = await API.get(`/payment/verify?session_id=${session_id}`);
        console.log("Payment verified successfully:", res.data);
        setStatus("success");
        const dashboardPath =
          role === "tutor" ? "/tutor-dashboard" : "/dashboard";
        setTimeout(() => navigate(dashboardPath), 2000);
      } catch (err: any) {
        console.error("Payment verification error:", err);

        if (err.response?.status === 401) {
          console.error("Authentication failed during payment verification");
          setStatus("auth_expired");
          setErrorMessage("Your session expired. Please sign in again.");
          setTimeout(() => navigate("/"), 3000);
        } else if (err.response?.status === 404) {
          console.error("Payment record not found");
          setStatus("error");
          setErrorMessage(
            "Payment record not found. Please contact support if the amount was deducted."
          );
          const dashboardPath =
            role === "tutor" ? "/tutor-dashboard" : "/dashboard";
          setTimeout(() => navigate(dashboardPath), 3000);
        } else if (attempt < 3 && err.code === "ECONNABORTED") {
          // Retry on timeout
          console.log(`Retrying payment verification... (${attempt}/3)`);
          setRetryCount(attempt);
          setTimeout(() => verifyPayment(attempt + 1), 2000);
        } else {
          console.error("Payment verification failed:", err.response?.data);
          setStatus("error");
          setErrorMessage(
            err.response?.data?.message ||
              "Unable to verify payment. Please contact support if amount was deducted."
          );
          const dashboardPath =
            role === "tutor" ? "/tutor-dashboard" : "/dashboard";
          setTimeout(() => navigate(dashboardPath), 3000);
        }
      }
    };

    verifyPayment();
  }, [session_id, navigate, role, token, authLoading]);

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
            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Retry attempt {retryCount}/3...
              </p>
            )}
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
            <button
              onClick={() => {
                const dashboardPath =
                  role === "tutor" ? "/tutor-dashboard" : "/dashboard";
                navigate(dashboardPath);
              }}
              className="mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 
                     transition-all px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-6xl mb-6">✗</div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-400 mb-4">
              {errorMessage ||
                "Unable to verify payment. Please contact support if amount was deducted."}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to dashboard...
            </p>
            <button
              onClick={() => {
                const dashboardPath =
                  role === "tutor" ? "/tutor-dashboard" : "/dashboard";
                navigate(dashboardPath);
              }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 
                     transition-all px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              Return to Dashboard
            </button>
          </>
        )}

        {status === "auth_expired" && (
          <>
            <div className="text-yellow-500 text-6xl mb-6">⚠</div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">
              Session Expired
            </h1>
            <p className="text-gray-400 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to login...
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 
                     transition-all px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
