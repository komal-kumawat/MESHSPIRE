"use client";
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
  skills?: string;
  role: string;
  languages?: string;
  subjects: string[];
  experience?: number;
  hourlyRate?: number;
  qualification?: string;
  document?: string[];
  resume?: string;
}
const subjectsList = [
  "Mathematics",
  "Science",
  "English",
  "Computer",
  "Hindi",
  "Biology",
  "Physics",
  "Chemistry",
];

const TutorUpdateProfile: React.FC = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    gender: "",
    age: undefined,
    avatar: "",
    bio: "",
    skills: "",
    role: "",
    languages: "",
    subjects: [],
    experience: undefined,
    hourlyRate: undefined,
    qualification: "",
    document: [],
    resume: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File[]>([]);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string[]>([]);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const userRes = await API.get(`/user/me`);
        const { name, email, role: accountRole } = userRes.data;

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
          age: profileData.age ? Number(profileData.age) : undefined,
          avatar: profileData.avatar || "",
          bio: profileData.bio || "",
          skills: Array.isArray(profileData.skills)
            ? profileData.skills.join(", ")
            : profileData.skills || "",

          // prefer profile role if present else fallback to account role
          role: profileData.role || accountRole || "",
          languages: Array.isArray(profileData.languages)
            ? profileData.languages.join(", ")
            : profileData.languages || "",

          subjects: Array.isArray(profileData.subjects)
            ? profileData.subjects
            : typeof profileData.subjects === "string"
            ? profileData.subjects.split(",").map((s: string) => s.trim())
            : [],

          experience: profileData.experience
            ? Number(profileData.experience)
            : undefined,

          hourlyRate: profileData.hourlyRate
            ? Number(profileData.hourlyRate)
            : undefined,

          qualification: Array.isArray(profileData.qualification)
            ? profileData.qualification.join(", ")
            : profileData.qualification || "",

          document: profileData.document || [],
          resume: profileData.resume || "",
        });
        setPreview(profileData.avatar || undefined);

        if (Array.isArray(profileData.document)) {
          setDocumentPreview(profileData.document);
        }

        if (profileData.resume) {
          setResumePreview(profileData.resume);
        }
        setSelectedSubjects(
          Array.isArray(profileData.subjects)
            ? profileData.subjects
            : typeof profileData.subjects === "string"
            ? profileData.subjects.split(",").map((s: string) => s.trim())
            : []
        );
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
    const { name, value, type } = e.target;

    // Clear validation errors when user starts fixing issues
    if (validationErrors.length > 0) {
      setValidationErrors([]);
      setMessage(null);
    }

    // Handle number inputs to avoid "0" display
    if (type === "number") {
      setUser((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value),
      }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
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
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Append new files to existing selectedDocument
    setSelectedDocument((prev) => [...prev, ...newFiles]);

    // Update preview list
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setDocumentPreview((prev) => [...prev, ...newPreviews]);
    setUser((prev) => ({
      ...prev,
      document: [
        ...(prev.document || []),
        ...newFiles.map((file) => file.name),
      ],
    }));

    // Clear validation errors when user uploads documents
    if (validationErrors.length > 0) {
      setValidationErrors([]);
      setMessage(null);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedResume(file);

      const url = URL.createObjectURL(file);
      setResumePreview(url);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreview(undefined);
    setUser((prev) => ({ ...prev, avatar: "" }));
  };
  const handleCheckboxChange = (subject: string) => {
    let updatedSubjects;

    if (selectedSubjects.includes(subject)) {
      updatedSubjects = selectedSubjects.filter((item) => item !== subject);
    } else {
      updatedSubjects = [...selectedSubjects, subject];
    }

    setSelectedSubjects(updatedSubjects);

    setUser((prev) => ({
      ...prev,
      subjects: updatedSubjects,
    }));

    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([]);
      setMessage(null);
    }
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
      // Do NOT allow role mutation from profile update; role is fixed at signup.
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
      formData.append(
        "subjects",
        Array.isArray(user.subjects)
          ? user.subjects.map((s) => s.trim()).join(",")
          : user.subjects
          ? (user.subjects as unknown as string)
              .split(",")
              .map((l) => l.trim())
              .join(",")
          : ""
      );
      formData.append(
        "qualification",
        user.qualification
          ? user.qualification
              .split(",")
              .map((l) => l.trim())
              .join(",")
          : ""
      );
      formData.append("experience", user.experience?.toString() || "");
      formData.append("hourlyRate", user.hourlyRate?.toString() || "");

      if (selectedDocument.length > 0) {
        selectedDocument.forEach((file) => {
          formData.append("document", file);
        });
      }

      if (selectedResume) formData.append("resume", selectedResume);

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      } else if (preview === undefined) {
        formData.append("avatar", "");
      }
      const errors: string[] = [];

      if (!user.subjects || user.subjects.length === 0) {
        errors.push("Subjects are required");
      }
      if (
        !user.experience ||
        user.experience === 0 ||
        user.experience === undefined
      ) {
        errors.push("Experience is required");
      }
      if (!user.languages || user.languages.trim() === "") {
        errors.push("Languages are required");
      }
      if (!user.qualification || user.qualification.trim() === "") {
        errors.push("Qualifications are required");
      }
      if (!user.document || user.document.length === 0) {
        errors.push("Documents are required");
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        setMessage("Please fill all required fields");
        setSaving(false);
        return;
      }

      await API.put(`/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setValidationErrors([]);
      setMessage("Profile updated successfully!");
      setTimeout(() => navigate(`/tutor-profile/${userId}`), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const Skeleton = () => (
    <div className="animate-pulse w-full max-w-5xl bg-slate-900/60 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl p-6 sm:p-10">
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
        <div className="flex flex-col items-center gap-4 md:w-1/3">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-800 rounded-full"></div>
          <div className="w-20 h-4 bg-slate-800 rounded"></div>
        </div>
        <div className="flex flex-col gap-4 md:w-2/3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-full h-10 bg-slate-800 rounded"></div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <main className="flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-6 sm:py-10 bg-gray-950 w-full overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl text-center mb-4 font-bold">
          UPDATE TUTOR PROFILE
        </h1>

        {loading ? (
          <Skeleton />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl bg-slate-900/70 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Left Section */}
            <div className="md:w-1/3 bg-slate-900/80 border-b md:border-b-0 md:border-r border-white/10 p-6 sm:p-8 flex flex-col items-center gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt={user.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-violet-700 shadow-lg"
                />
              ) : (
                <FaUserAlt size={100} className="text-gray-500" />
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
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 transition-all duration-300 rounded-xl font-semibold shadow-md text-white text-sm sm:text-base"
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

              <p className="text-gray-400 text-sm sm:text-base">{user.email}</p>
              <p className="text-gray-400 text-sm sm:text-base">{user.role}</p>

              <button
                className="mt-3 sm:mt-4 px-5 sm:px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-800 hover:from-gray-700 hover:to-gray-700 transition-all duration-300 rounded-2xl font-semibold shadow-lg text-white text-sm sm:text-base"
                onClick={() => {
                  const missing =
                    !user.subjects ||
                    user.subjects.length === 0 ||
                    !user.experience ||
                    user.experience === 0 ||
                    !user.languages ||
                    user.languages.trim() === "" ||
                    !user.qualification ||
                    user.qualification.trim() === "" ||
                    !user.document ||
                    user.document.length === 0;

                  if (missing) {
                    alert(
                      "Subjects, Experience, Languages, Qualification, and Documents are mandatory."
                    );
                  } else {
                    navigate("/tutor-dashboard");
                  }
                }}
                type="button"
              >
                Go back to Dashboard
              </button>
            </div>

            {/* Right Section */}
            <div className="md:w-2/3 p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-800 scrollbar-track-slate-900 max-h-[80vh] md:max-h-[90vh]">
              {[
                {
                  label: "Name",
                  name: "name",
                  type: "text",
                  placeholder: "Enter your full name",
                },
                {
                  label: "Age",
                  name: "age",
                  type: "number",
                  placeholder: "Enter your age",
                  min: 18,
                },
                {
                  label: "Skills (comma separated)",
                  name: "skills",
                  type: "text",
                  placeholder: "e.g., Python, JavaScript, Problem Solving",
                },
                {
                  label: "Languages (comma separated)",
                  name: "languages",
                  type: "text",
                  required: true,
                  placeholder: "e.g., English, Hindi, Spanish",
                },

                {
                  label: "Experience (in years)",
                  name: "experience",
                  type: "number",
                  required: true,
                  placeholder: "Years of teaching experience",
                  min: 0,
                },
                {
                  label: "Hourly Rate",
                  name: "hourlyRate",
                  type: "number",
                  placeholder: "Rate in your currency",
                  min: 0,
                },
                {
                  label: "Qualifications",
                  name: "qualification",
                  type: "text",
                  required: true,
                  placeholder: "e.g., B.Tech, M.Sc, PhD",
                },
              ].map((field: any) => (
                <label key={field.name} className="flex flex-col text-gray-200">
                  <span>
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(user as any)[field.name] ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    min={field.min}
                    className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:ring-2 focus:ring-violet-700 outline-none transition text-sm sm:text-base"
                  />
                </label>
              ))}

              <label className="flex flex-col text-gray-200">
                Gender
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:ring-2 focus:ring-violet-700 outline-none transition text-sm sm:text-base"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="flex flex-col text-gray-200">
                <span>
                  Subjects <span className="text-red-500">*</span>
                </span>

                <div>
                  {/* Dropdown Box */}
                  <div
                    className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-violet-700 cursor-pointer transition text-sm sm:text-base"
                    onClick={() => setOpen(!open)}
                  >
                    {selectedSubjects.length === 0 ? (
                      <span className="text-gray-400">
                        Click to select subjects
                      </span>
                    ) : (
                      <span>{selectedSubjects.join(", ")}</span>
                    )}
                  </div>

                  {/* Dropdown Content */}
                  {open && (
                    <div className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-violet-700 shadow-lg max-h-60 overflow-y-auto text-sm sm:text-base">
                      {subjectsList.map((subject) => (
                        <label
                          key={subject}
                          className="flex items-center gap-2 py-2 hover:bg-slate-800 rounded px-2 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject)}
                            onChange={() => handleCheckboxChange(subject)}
                            className="cursor-pointer w-4 h-4"
                          />
                          {subject}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              <label className="flex flex-col text-gray-200">
                Bio
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  placeholder="Tell something about yourself"
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:ring-2 focus:ring-violet-700 outline-none transition resize-none text-sm sm:text-base"
                  rows={4}
                />
              </label>

              <div className="mt-4 p-4 bg-slate-900/80 border border-white/20 rounded-2xl shadow-sm">
                <label className="block text-gray-200 font-medium mb-2">
                  Documents <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  multiple
                  onChange={handleDocumentUpload}
                  className="w-full text-sm text-gray-400 file:bg-violet-800 file:text-white file:px-3 file:py-1 file:rounded-lg file:border-none hover:file:bg-violet-700 transition-colors"
                />

                {documentPreview.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {documentPreview.map((preview, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center bg-slate-800 p-2 rounded-xl border border-white/10 shadow-sm"
                      >
                        {preview.startsWith("data:image") ? (
                          <img
                            src={preview}
                            className="w-28 h-28 object-cover rounded-md"
                          />
                        ) : (
                          <iframe
                            src={preview}
                            className="w-28 h-28 border rounded-md"
                          />
                        )}
                        <p className="text-xs text-gray-300 mt-1 truncate">
                          Doc {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-slate-900/80 border border-white/20 rounded-2xl shadow-sm">
                <label className="block text-gray-200 font-medium mb-2">
                  Resume
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="w-full text-sm text-gray-400 file:bg-violet-800 file:text-white file:px-3 file:py-1 file:rounded-lg file:border-none hover:file:bg-violet-700 transition-colors"
                />

                {resumePreview && (
                  <div className="mt-3 flex flex-col items-center bg-slate-800 p-3 rounded-xl border border-white/10 shadow-sm">
                    <p className="text-sm text-gray-300 mb-2">
                      Resume Preview:
                    </p>
                    {selectedResume?.type.includes("pdf") ? (
                      <iframe
                        src={resumePreview}
                        className="w-36 h-36 border rounded-md"
                      />
                    ) : (
                      <div className="w-36 h-36 border rounded-md p-2 flex justify-center items-center bg-slate-800 text-xs text-gray-200">
                        📄 {selectedResume?.name}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {validationErrors.length > 0 && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
                  <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Please complete the following required fields:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-red-300 text-sm">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className={`mt-4 sm:mt-6 w-full py-2 sm:py-3 rounded-2xl font-semibold text-base sm:text-lg shadow-lg transition-all duration-300 ${
                  saving
                    ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 text-white"
                }`}
              >
                {saving ? "Updating..." : "Update Profile"}
              </button>

              {message && (
                <p
                  className={`text-center mt-3 sm:mt-4 font-medium transition-all duration-300 ${
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

export default TutorUpdateProfile;
