"use client";
import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email?: string;
  gender: string;
  age?: number;
  avatar?: string;
  bio?: string;
  skills?: string[];
  role: string;
  languages?: string[];
}

const Profile: React.FC = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const userRes = await API.get(`/user/me`);
        const { name, email } = userRes.data;

        let profileData: Partial<User> = {};
        try {
          const profileRes = await API.get(`/profile/${userId}`);
          profileData = profileRes.data;
        } catch {
          console.log("No profile data found.");
        }

        setUser({
          name,
          email,
          gender: profileData.gender || "",
          age: profileData.age || 0,
          avatar: profileData.avatar || "",
          bio: profileData.bio || "",
          skills: profileData.skills || [],
          role: profileData.role || "",
          languages: profileData.languages || [],
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const Skeleton = () => (
    <div className="animate-pulse flex flex-col items-center gap-6 w-full max-w-5xl bg-slate-900/50 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl p-10">
      <div className="w-32 h-32 rounded-full bg-slate-800" />
      <div className="w-1/3 h-6 bg-slate-800 rounded"></div>
      <div className="w-1/4 h-5 bg-slate-800 rounded"></div>
      <div className="w-full h-24 bg-slate-800 rounded mt-6"></div>
      <div className="w-full h-16 bg-slate-800 rounded"></div>
      <div className="w-full h-16 bg-slate-800 rounded"></div>
      <div className="w-1/2 h-12 bg-slate-800 rounded mt-4"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <main className="flex flex-col items-center justify-center px-6 py-10 md:py-20 bg-gray-950 min-h-screen">
        <h1 className="text-5xl text-center mb-10">PROFILE</h1>

        {loading ? (
          <Skeleton />
        ) : !user ? (
          <div className="text-gray-300 text-xl">Profile not found.</div>
        ) : (
          <div className="w-full max-w-5xl bg-slate-900/70 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl flex flex-col md:flex-row overflow-hidden transition-all duration-500">
            <div className="md:w-1/3 p-8 flex flex-col items-center justify-center bg-slate-900/80 border-b md:border-b-0 md:border-r border-white/10">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-36 h-36 rounded-full object-cover border-4 border-violet-700 shadow-lg mb-4"
                />
              ) : (
                <FaUserAlt size={120} className="text-gray-500 mb-4" />
              )}
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-violet-400 font-semibold">{user.role}</p>
              <p className="text-gray-400 text-sm mt-2">{user.email}</p>

              <button
                className="mt-6 px-6 py-3 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 hover:from-gray-700 hover:to-gray-700 transition-all duration-300 rounded-2xl font-semibold shadow-lg text-white"
                onClick={() => navigate("/dashboard")}
              >
                Go back to Dashboard
              </button>
            </div>
            <div className="md:w-2/3 p-8 flex flex-col gap-6">
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-sm">
                <h3 className="text-xl font-semibold text-white mb-2">About</h3>
                <p className="text-gray-300">
                  {user.bio || "No bio added yet."}
                </p>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-sm">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Skills
                </h3>
                <p className="text-gray-300">
                  {user.skills?.length
                    ? user.skills.join(", ")
                    : "No skills added."}
                </p>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-sm">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Languages
                </h3>
                <p className="text-gray-300">
                  {user.languages?.length
                    ? user.languages.join(", ")
                    : "No languages added."}
                </p>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 grid grid-cols-2 gap-4 backdrop-blur-sm shadow-sm">
                <p>
                  <span className="font-semibold text-white">Gender:</span>{" "}
                  <span className="text-gray-300">{user.gender}</span>
                </p>
                <p>
                  <span className="font-semibold text-white">Age:</span>{" "}
                  <span className="text-gray-300">{user.age || "N/A"}</span>
                </p>
              </div>

              <button
                onClick={() => navigate("/update-profile")}
                className="w-full mt-4 py-4 bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 transition-all duration-300 rounded-2xl font-semibold shadow-lg text-lg"
              >
                Update Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
