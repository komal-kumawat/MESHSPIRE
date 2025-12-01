import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const session_id = params.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!session_id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/payment/verify?session_id=${session_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        alert("Payment Completed 🎉");
        console.log(res.data);
        navigate("/dashboard"); // redirect after success
      })
      .catch((err) => {
        alert("Payment verification failed ❌");
        console.error(err);
        navigate("/payment-failed"); // redirect on failure
      });
  }, [session_id]);

  return <h1 className="text-green-500 text-center mt-10">Verifying Payment...</h1>;
}
