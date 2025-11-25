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
  class : number;
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
        const { name, email, role: accountRole } = userRes.data;

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
          class: profileData.class || 0,
          avatar: profileData.avatar || "",
          bio: profileData.bio || "",
          skills: profileData.skills || [],
          // fallback to account role if profile record lacks role
          role: profileData.role || accountRole || "",
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
    <div className="animate-pulse flex flex-col items-center gap-6 w-full max-w-5xl bg-slate-900/50 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl p-6 sm:p-10">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-800" />
      <div className="w-2/3 sm:w-1/3 h-6 bg-slate-800 rounded"></div>
      <div className="w-1/2 sm:w-1/4 h-5 bg-slate-800 rounded"></div>
      <div className="w-full h-16 sm:h-24 bg-slate-800 rounded mt-4 sm:mt-6"></div>
      <div className="w-full h-12 sm:h-16 bg-slate-800 rounded"></div>
      <div className="w-full h-12 sm:h-16 bg-slate-800 rounded"></div>
      <div className="w-3/4 sm:w-1/2 h-10 sm:h-12 bg-slate-800 rounded mt-4"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <main className="flex flex-col items-center justify-start md:justify-center px-4 sm:px-6 py-8 md:py-10 overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl text-center mb-6 font-bold">
          PROFILE
        </h1>

        {loading ? (
          <Skeleton />
        ) : !user ? (
          <div className="text-gray-300 text-lg sm:text-xl">
            Profile not found.
          </div>
        ) : (
          <div
            className="w-full max-w-5xl bg-slate-900/70 border border-white/10 rounded-2xl 
              shadow-xl backdrop-blur-xl flex flex-col md:flex-row overflow-hidden 
              transition-all duration-500"
          >
            {/* Left Profile Section */}
            <div
              className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col items-center justify-center 
              bg-slate-900/80 border-b md:border-b-0 md:border-r border-white/10"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-violet-700 shadow-lg mb-4"
                />
              ) : (
                <FaUserAlt
                  size={80}
                  className="sm:size-[120px] text-gray-500 mb-4"
                />
              )}

              <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
                {user.name}
              </h2>
              <p className="text-violet-400 font-semibold text-sm sm:text-base">
                {user.role || "Member"}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2 text-center break-all">
                {user.email}
              </p>

              <button
                className="mt-6 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 
                  hover:from-gray-700 hover:to-gray-700 transition-all duration-300 rounded-2xl 
                  font-semibold shadow-lg text-sm sm:text-base"
                onClick={() =>
                  navigate(
                    user.role === "tutor" ? "/tutor-dashboard" : "/dashboard"
                  )
                }
              >
                Go back to Dashboard
              </button>
            </div>

            {/* Right Profile Details Section */}
            <div className="w-full md:w-2/3 p-6 sm:p-8 flex flex-col gap-4 sm:gap-6">
              {/* About */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  About
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {user.bio || "No bio added yet."}
                </p>
              </div>

              {/* Skills */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  Skills
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  {user.skills?.length
                    ? user.skills.join(", ")
                    : "No skills added."}
                </p>
              </div>

              {/* Languages */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  Languages
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  {user.languages?.length
                    ? user.languages.join(", ")
                    : "No languages added."}
                </p>
              </div>

              {/* Gender & Age */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 backdrop-blur-sm shadow-sm">
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-white">Gender:</span>{" "}
                  <span className="text-gray-300">{user.gender || "N/A"}</span>
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-white">Age:</span>{" "}
                  <span className="text-gray-300">{user.age || "N/A"}</span>
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-white">Class:</span>{" "}
                  <span className="text-gray-300">{user.class || "N/A"}</span>
                </p>
              </div>

              {/* Update Button */}
              <button
                onClick={() => navigate("/update-profile")}
                className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 
                  hover:from-violet-800 hover:to-violet-700 transition-all duration-300 
                  rounded-2xl font-semibold shadow-lg text-base sm:text-lg"
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
