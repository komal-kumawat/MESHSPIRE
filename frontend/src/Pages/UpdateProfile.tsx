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
  skills?: string; // comma separated
  role: string;
  languages?: string; // comma separated
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch user + profile
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

        setPreview(profileData.avatar || undefined);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle text input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setUser((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove avatar
  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreview(undefined);
    setUser((prev) => ({ ...prev, avatar: "" }));
  };

  // Submit profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("gender", user.gender);
      formData.append("age", user.age?.toString() || "");
      formData.append("bio", user.bio || "");
      formData.append("role", user.role);
      formData.append(
        "skills",
        user.skills ? user.skills.split(",").map((s) => s.trim()).join(",") : ""
      );
      formData.append(
        "languages",
        user.languages ? user.languages.split(",").map((l) => l.trim()).join(",") : ""
      );

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      } else if (preview === undefined) {
        formData.append("avatar", ""); // remove avatar
      }

      await API.put(`/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Profile updated successfully!");
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error(err);
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
          {preview ? (
            <img
              src={preview}
              alt={user.name}
              className="w-36 h-36 rounded-full object-cover border-2 border-cyan-400"
            />
          ) : (
            <FaUserAlt size={120} className="text-gray-400" />
          )}

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="avatarInput"
            className="hidden"
          />

          {/* Custom button */}
          <button
            type="button"
            onClick={() => document.getElementById("avatarInput")?.click()}
            className="mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition"
          >
            Choose File
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-red-400 mt-2 text-sm hover:underline"
            >
              Remove Photo
            </button>
          )}



          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-400">{user.role}</p>

          <button
            className="my-5 p-2 bg-cyan-500 font-bold text-white rounded-xl hover:bg-cyan-600"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            Go back to Dashboard
          </button>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 p-6 flex flex-col gap-4">
          <label>
            Name
            <input
              type="string"
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
            />
          </label>
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
            <p
              className={`text-center mt-2 ${message.includes("successfully") ? "text-green-400" : "text-red-400"
                }`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
