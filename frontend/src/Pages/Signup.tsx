import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import API from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",      
    email: "",
    password: "",
    avatarUrl: "", 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.post("/user/signup", form);
      localStorage.setItem("token", res.data.token);
      navigate("/signin");
    } catch (err) {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl w-96 border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
            placeholder="Full Name"
            name="name"
            onChange={handleChange}
          />
          <input
            className="w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        <p className="text-sm mt-6 text-gray-400 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
