"use client";
import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  gender: string;
  age?: number;
  avatar?: string;
  bio?: string;
  skills?: string;          // now a simple string
  role: string;
  languages?: string;
  subjects: string;
  experience?: number;
  hourlyRate?: number;
  qualification?: string;
  document?: string;
  resume?: string;
}

const TutorProfile: React.FC = () => {
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

        // FIXED: No more .join() crashes
        setUser({
          name,
          email,
          gender: profileData.gender || "",
          age: profileData.age || 0,
          avatar: profileData.avatar || "",
          bio: profileData.bio || "",

          skills: Array.isArray(profileData.skills)
            ? profileData.skills.join(", ")
            : profileData.skills || "",

          role: profileData.role || accountRole || "",

          languages: Array.isArray(profileData.languages)
            ? profileData.languages.join(", ")
            : profileData.languages || "",

          subjects: Array.isArray(profileData.subjects)
            ? profileData.subjects.join(", ")
            : profileData.subjects || "",

          experience: Number(profileData.experience) || 0,

          hourlyRate: Number(profileData.hourlyRate) || 0,

          qualification: Array.isArray(profileData.qualification)
            ? profileData.qualification.join(", ")
            : profileData.qualification || "",

          document: profileData.document || "",
          resume: profileData.resume || "",
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
          TUTOR PROFILE
        </h1>

        {loading ? (
          <Skeleton />
        ) : !user ? (
          <div className="text-gray-300 text-lg sm:text-xl">Profile not found.</div>
        ) : (
          <div className="w-full max-w-5xl bg-slate-900/70 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl flex flex-col md:flex-row overflow-hidden transition-all duration-500">
            
            {/* LEFT SECTION */}
            <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-900/80 border-b md:border-b-0 md:border-r border-white/10">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-violet-700 shadow-lg mb-4"
                />
              ) : (
                <FaUserAlt size={80} className="sm:size-[120px] text-gray-500 mb-4" />
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
                className="mt-6 px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-2xl font-semibold shadow-lg text-sm sm:text-base"
                onClick={() =>
                  navigate(user.role === "tutor" ? "/tutor-dashboard" : "/dashboard")
                }
              >
                Go back to Dashboard
              </button>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full md:w-2/3 p-6 sm:p-8 flex flex-col gap-5">

              {/* ABOUT */}
              <ProfileCard title="About" value={user.bio || "No bio added yet."} />

              {/* SKILLS */}
              <ProfileCard title="Skills" value={user.skills || "No skills added."} />

              {/* SUBJECTS */}
              <ProfileCard title="Subjects" value={user.subjects || "No subjects added."} />

              {/* QUALIFICATION */}
              <ProfileCard title="Qualification" value={user.qualification || "No qualification added."} />

              {/* LANGUAGES */}
              <ProfileCard title="Languages" value={user.languages || "No languages added."} />

              {/* GENDER & AGE */}
              <TwoColCard leftLabel="Gender" leftValue={user.gender} rightLabel="Age" rightValue={user.age} />

              {/* EXPERIENCE & HOURLY RATE */}
              <TwoColCard
                leftLabel="Experience (Years)"
                leftValue={user.experience}
                rightLabel="Hourly Rate"
                rightValue={user.hourlyRate}
              />

              {/* DOCUMENTS PREVIEW */}
              <ProfileCard
                title="Resume"
                value={
                  user.resume ? (
                    <a
                      href={user.resume}
                      target="_blank"
                      className="text-blue-400 underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    "No resume uploaded."
                  )
                }
              />

              <ProfileCard
                title="Document"
                value={
                  user.document ? (
                    <a
                      href={user.document}
                      target="_blank"
                      className="text-blue-400 underline"
                    >
                      View Document
                    </a>
                  ) : (
                    "No document uploaded."
                  )
                }
              />

              {/* UPDATE BUTTON */}
              <button
                onClick={() => navigate("/update-tutor-profile")}
                className="w-full mt-2 py-3 sm:py-4 bg-violet-800 hover:bg-violet-700 transition-all duration-300 rounded-2xl font-semibold shadow-lg text-base sm:text-lg"
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

/* ---------------------------------------------------------------------- */
/* SMALL REUSABLE COMPONENTS                                              */
/* ---------------------------------------------------------------------- */

const ProfileCard = ({ title, value }: { title: string; value: any }) => (
  <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm shadow-sm">
    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm sm:text-base">{value}</p>
  </div>
);

const TwoColCard = ({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: any;
  rightLabel: string;
  rightValue: any;
}) => (
  <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 backdrop-blur-sm shadow-sm">
    <p className="text-sm sm:text-base">
      <span className="font-semibold text-white">{leftLabel}:</span>{" "}
      <span className="text-gray-300">{leftValue || "N/A"}</span>
    </p>
    <p className="text-sm sm:text-base">
      <span className="font-semibold text-white">{rightLabel}:</span>{" "}
      <span className="text-gray-300">{rightValue || "N/A"}</span>
    </p>
  </div>
);

export default TutorProfile;
