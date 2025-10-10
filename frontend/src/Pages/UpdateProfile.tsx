import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";

interface User {
  name: string;
  email: string;
  gender: string;
  age?: number;
  avatar?: string;
  bio?: string;
  skills?: string;     // for form input (comma separated)
  role: string;
  languages?: string;  // for form input (comma separated)
}

const UpdateProfile: React.FC = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    gender: "",
    age: 0,
    avatar: "",
    bio: "",
    skills: "",
    role: "",
    languages: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const userRes = await API.get(`/user/me`);
        const { name, email } = userRes.data;

        let profileData: any = {};
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
          skills: profileData.skills ? profileData.skills.join(", ") : "",
          role: profileData.role || "",
          languages: profileData.languages ? profileData.languages.join(", ") : "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setMessage(null);

    try {
      // Convert comma-separated strings to arrays for API
      const payload = {
        ...user,
        skills: user.skills ? user.skills.split(",").map(s => s.trim()) : [],
        languages: user.languages ? user.languages.split(",").map(l => l.trim()) : [],
      };
      
      await API.put(`/profile/update`, payload);
      setMessage("Profile updated successfully!");
      navigate(`/profile/${userId}`);
    } catch (err) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-start p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 text-white rounded-2xl shadow-lg max-w-4xl w-full flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Column */}
        <div className="md:w-1/3 bg-gray-800 p-6 flex flex-col items-center gap-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-36 h-36 rounded-full object-cover border-2 border-cyan-400"
            />
          ) : (
            <FaUserAlt size={120} className="text-gray-400" />
          )}

          <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-400">{user.role}</p>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 p-6 flex flex-col gap-4">
          <label>
            Gender
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Age
            <input
              type="number"
              name="age"
              value={user.age || ""}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
            />
          </label>

          <label>
            Bio
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none resize-none"
              placeholder="Tell something about yourself"
            />
          </label>

          <label>
            Skills (comma separated)
            <input
              type="text"
              name="skills"
              value={user.skills}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
            />
          </label>

          <label>
            Languages (comma separated)
            <input
              type="text"
              name="languages"
              value={user.languages}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
            />
          </label>

          <label>
            Role
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          {message && (
            <p className={`text-center mt-2 ${message.includes("successfully") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
