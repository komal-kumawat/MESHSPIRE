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
  const [hasProfile, setHasProfile] = useState<boolean>(false);
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
          setHasProfile(true);
        } catch {
          console.log("No profile data found.");
          setHasProfile(false);
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

  if (loading) return <div className="text-white p-10">Loading profile...</div>;
  if (!user) return <div className="text-white p-10">Profile not found.</div>;

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col items-center py-10 px-4">
      {/* Header */}
      <h1 className="text-white text-4xl font-bold text-center mb-8 w-full">PROFILE</h1>

      {/* Profile Card */}
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
        {/* LEFT: Avatar & basic info */}
        <div className="md:w-1/3 bg-gray-800 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-700">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-36 h-36 rounded-full object-cover border-4 border-cyan-400 mb-4"
            />
          ) : (
            <FaUserAlt size={120} className="text-gray-500 mb-4" />
          )}
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-cyan-400 font-semibold">{user.role}</p>
          <p className="text-gray-400 text-sm mt-2">{user.email}</p>
        </div>

        {/* RIGHT: Profile details */}
        <div className="md:w-2/3 p-8 space-y-6">
          {/* About Section */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-2">About</h3>
            <p className="text-gray-300">{user.bio || "No bio added yet."}</p>
          </div>

          {/* Skills */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
            <p className="text-gray-300">{user.skills?.length ? user.skills.join(", ") : "No skills added."}</p>
          </div>

          {/* Languages */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Languages</h3>
            <p className="text-gray-300">{user.languages?.length ? user.languages.join(", ") : "No languages added."}</p>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-sm grid grid-cols-2 gap-4">
            <p><span className="font-semibold text-white">Gender:</span> <span className="text-gray-300">{user.gender}</span></p>
            <p><span className="font-semibold text-white">Age:</span> <span className="text-gray-300">{user.age || "N/A"}</span></p>
          </div>
          {hasProfile?

          <button
            onClick={() => navigate("/update-profile")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition mt-4"
          >
            Update Profile
          </button>
          :<button
            onClick={() => navigate("/create-profile")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition mt-4"
          >
            Create Profile
          </button>

          }
        </div>
      </div>
    </div>
  );
};

export default Profile;
