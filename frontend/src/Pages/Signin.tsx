import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // axios instance
import { useAuth } from "../Context/AuthContext";

interface SigninForm {
  email: string;
  password: string;
}

interface SigninResponse {
  access: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export default function Signin() {
  const [form, setForm] = useState<SigninForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await API.post<SigninResponse>("api/v0/user/signin", form);
      console.log("Signin response:", res.data); // 👀 log to verify

      // ✅ take name from res.data.user.name, token from res.data.access
      setUser(res.data.user.name, res.data.access);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signin error:", err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Signin failed";
      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl w-96 border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-400 bg-white/5 p-2 rounded">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <p className="text-sm mt-6 text-gray-400 text-center">
          Don’t have an account?{" "}
          <a href="/" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
