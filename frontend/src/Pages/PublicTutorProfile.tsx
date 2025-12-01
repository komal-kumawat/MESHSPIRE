"use client";
import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import API from "../api"; // your axios instance
import { useParams } from "react-router-dom";

interface PublicUser {
  name: string;
  gender: string;
  age?: number;
  avatar?: string;
  bio?: string;
  skills?: string;
  role?: string;
  languages?: string;
  subjects?: string;
  experience?: number;
  hourlyRate?: number;
  qualification?: string;
  document?: string[];
  resume?: string;
}

const PublicTutorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // tutor userId from URL
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profile/tutor/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

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
          {user?.name?.toUpperCase()} PROFILE
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
                {user.role || "Tutor"}
              </p>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full md:w-2/3 p-6 sm:p-8 flex flex-col gap-5">

              <ProfileCard title="About" value={user.bio || "No bio added yet."} />
              <ProfileCard title="Skills" value={Array.isArray(user.skills) ? user.skills.join(", "): user.skills || "No skills added."} />
              <ProfileCard title="Subjects" value={Array.isArray(user.subjects) ? user.subjects.join(", ") : user.subjects || "No subjects added."} />
              <ProfileCard title="Qualification" value={user.qualification || "No qualification added."} />
              <ProfileCard title="Languages" value={Array.isArray(user.languages) ? user.languages.join(", ") :user.languages || "No languages added."} />

              <TwoColCard leftLabel="Gender" leftValue={user.gender} rightLabel="Age" rightValue={user.age} />
              <TwoColCard leftLabel="Experience (Years)" leftValue={user.experience} rightLabel="Hourly Rate(₹)" rightValue={user.hourlyRate} />

              <ProfileCard
                title="Resume"
                value={
                  user.resume ? (
                    <a href={user.resume} target="_blank" className="text-blue-400 underline">
                      View Resume
                    </a>
                  ) : (
                    "No resume uploaded."
                  )
                }
              />

              <ProfileCard
                title="Documents"
                value={
                  user.document && user.document.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.document.map((doc, idx) => (
                        <a key={idx} href={doc} target="_blank" className="text-blue-400 underline text-sm">
                          Document {idx + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    "No document uploaded."
                  )
                }
              />

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

export default PublicTutorProfile;
