"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import Navbar from "../Components/Navbar";

interface User {
  name: string;
  email: string;
  gender: string;
  age?: number;
  avatar?: string;
  bio?: string;
  skills?: string;
  role: string;
  languages?: string;
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          languages: profileData.languages
            ? profileData.languages.join(", ")
            : "",
        });
        setPreview(profileData.avatar || undefined);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreview(undefined);
    setUser((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
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
        user.skills
          ? user.skills
              .split(",")
              .map((s) => s.trim())
              .join(",")
          : ""
      );
      formData.append(
        "languages",
        user.languages
          ? user.languages
              .split(",")
              .map((l) => l.trim())
              .join(",")
          : ""
      );

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      } else if (preview === undefined) {
        formData.append("avatar", "");
      }

      await API.put(`/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Profile updated successfully!");
      setTimeout(() => navigate(`/profile/${userId}`), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const Skeleton = () => (
    <div className="animate-pulse w-full max-w-5xl bg-slate-900/60 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl p-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center gap-4 md:w-1/3">
          <div className="w-32 h-32 bg-slate-800 rounded-full"></div>
          <div className="w-24 h-4 bg-slate-800 rounded"></div>
          <div className="w-16 h-4 bg-slate-800 rounded"></div>
        </div>
        <div className="flex flex-col gap-4 md:w-2/3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-full h-12 bg-slate-800 rounded"></div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white overflow-hidden">
      <main className="flex flex-col items-center justify-center px-6 py-4 bg-gray-950 min-h-screen">
        <h1 className="text-4xl text-center mb-4">UPDATE PROFILE</h1>

        {loading ? (
          <Skeleton />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl bg-slate-900/70 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          >
            {/* LEFT PANEL */}
            <div className="md:w-1/3 bg-slate-900/80 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col items-center gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt={user.name}
                  className="w-36 h-36 rounded-full object-cover border-4 border-violet-700 shadow-lg"
                />
              ) : (
                <FaUserAlt size={120} className="text-gray-500" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="avatarInput"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => document.getElementById("avatarInput")?.click()}
                className="px-6 py-2 bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 transition-all duration-300 rounded-xl font-semibold shadow-md text-white"
              >
                Choose File
              </button>

              {preview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove Photo
                </button>
              )}

              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">{user.role}</p>

              <button
                className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 hover:from-gray-700 hover:to-gray-700 transition-all duration-300 rounded-2xl font-semibold shadow-lg text-white"
                onClick={() => navigate("/dashboard")}
                type="button"
              >
                Go back to Dashboard
              </button>
            </div>

            {/* RIGHT PANEL (scrollable only) */}
            <div className="md:w-2/3 p-6 flex flex-col gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-800 scrollbar-track-slate-900 max-h-[90vh]">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Age", name: "age", type: "number" },
                {
                  label: "Skills (comma separated)",
                  name: "skills",
                  type: "text",
                },
                {
                  label: "Languages (comma separated)",
                  name: "languages",
                  type: "text",
                },
              ].map((field) => (
                <label key={field.name} className="flex flex-col text-gray-200">
                  {field.label}
                  <input
                    type={field.type}
                    name={field.name}
                    value={(user as any)[field.name]}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:ring-2 focus:ring-violet-700 outline-none transition"
                  />
                </label>
              ))}

              <label className="flex flex-col text-gray-200">
                Gender
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:ring-2 focus:ring-violet-700 outline-none transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="flex flex-col text-gray-200">
                Bio
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  placeholder="Tell something about yourself"
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:ring-2 focus:ring-violet-700 outline-none transition resize-none"
                  rows={4}
                />
              </label>

              <label className="flex flex-col text-gray-200">
                Role
                <select
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:ring-2 focus:ring-violet-700 outline-none transition"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={saving}
                className={`mt-6 w-full py-2 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                  saving
                    ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 text-white"
                }`}
              >
                {saving ? "Updating..." : "Update Profile"}
              </button>

              {message && (
                <p
                  className={`text-center mt-4 font-medium transition-all duration-300 ${
                    message.includes("success")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default UpdateProfile;
