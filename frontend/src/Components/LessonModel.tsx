"use client";
import React, { useState, useEffect } from "react";
import calculus from "../assets/calculus.png";
import quantum from "../assets/quantum-computing.png";
import ComputerScience from "../assets/python.png";
import Probability from "../assets/probablity.png";
import { useAuth } from "../Context/AuthContext";

interface LessonModelProps {
  topic: string;
  subject: string;
  time: string;
  onViewDetails: () => void;
  studentName?: string;

  showActions?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  isConfirmed?: boolean;
  isProcessing?: boolean;

  isPaid?: boolean;
  date?: string;
  lessonTime?: string;
  onStartMeeting?: () => void;
  onStartChat?: () => void;
  onEditLesson?: () => void;
  onDelete?: () => void;
  hasConfirmedTutors?: boolean;
}

const subjectImages: Record<string, string> = {
  Mathematics: calculus,
  Science: quantum,
  English: Probability,
  ComputerScience: ComputerScience,
};

const LessonModel: React.FC<LessonModelProps> = (props) => {
  const {
    topic,
    subject,
    time,
    onViewDetails,
    studentName,
    showActions = false,
    onConfirm,
    onCancel,
    isConfirmed,
    isProcessing = false,
    isPaid = false,
    date,
    lessonTime,
    onStartMeeting,
    onStartChat,
    onEditLesson,
    onDelete,
    hasConfirmedTutors = false,
  } = props;

  const [isMeetingTimeReached, setIsMeetingTimeReached] = useState(false);
  const { role } = useAuth();

  // Meeting Unlock Logic
  useEffect(() => {
    if (!date || !lessonTime) return;

    const checkTime = () => {
      const [hours, minutes] = lessonTime.split(":");
      const lessonDate = new Date(date);
      lessonDate.setHours(+hours, +minutes, 0, 0);

      const now = new Date();
      const tenMinBefore = new Date(lessonDate.getTime() - 10 * 60 * 1000);
      const end = new Date(lessonDate.getTime() + 60 * 60 * 1000);

      setIsMeetingTimeReached(now >= tenMinBefore && now <= end);
    };

    checkTime();
    const interval = setInterval(checkTime, 30000);
    return () => clearInterval(interval);
  }, [date, lessonTime]);

  const imageSrc = subjectImages[subject] || Probability;

  return (
    <div
      className={`
      flex flex-col w-[260px] sm:w-[380px] md:w-[480px]
      p-5 sm:p-6 rounded-2xl
      backdrop-blur-xl bg-gradient-to-b from-slate-900/80 to-slate-900/50 
      shadow-xl hover:shadow-2xl
      transition-all duration-300 relative
      border hover:border-emerald-500/30
      ${
        hasConfirmedTutors && !isPaid
          ? "border-emerald-500/60 shadow-emerald-500/20 ring-2 ring-emerald-500/20"
          : "border-white/10"
      }
      `}
    >
      {/* Delete Button - Top Right Corner */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-red-900/30 hover:bg-red-800/50 
                     border border-red-500/30 hover:border-red-500/50 transition-all duration-200 
                     hover:scale-110 active:scale-95 z-10 group"
          title="Delete lesson"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-400 group-hover:text-red-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="w-24 sm:w-28 md:w-32 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/5 hover:ring-emerald-500/30 transition-all">
          <img
            src={imageSrc}
            alt={subject}
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className="text-xs font-semibold text-emerald-200 bg-emerald-500/10
                      px-3 py-1.5 rounded-full border border-emerald-500/30"
        >
          {subject}
        </span>
      </div>

      {/* Topic */}
      <h2 className="mt-4 text-lg sm:text-xl font-bold text-white leading-tight">
        {topic}
      </h2>

      {/* Student / Instructor */}
      <p className="text-sm text-gray-300 mt-1">
        {studentName ? (
          role === "tutor" ? (
            <>
              👤 Student: <span className="text-white">{studentName}</span>
            </>
          ) : (
            <>
              👤 Instructor: <span className="text-white">{studentName}</span>
            </>
          )
        ) : isConfirmed ? (
          <span className="text-green-300">Tutor Confirmed ✅</span>
        ) : (
          <span className="text-red-300"></span>
        )}
      </p>

      {/* Time */}
      <div
        className="mt-3 flex items-center gap-3 text-sm text-gray-300 
                      bg-slate-800/50 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-medium">{time}</span>
      </div>

      {/* Payment */}
      {isPaid && (
        <div
          className="mt-2 text-sm text-emerald-300 bg-emerald-900/30 backdrop-blur-sm px-4 py-2.5 rounded-xl
                        border border-emerald-500/30 flex items-center gap-2 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Payment Confirmed
        </div>
      )}

      {/* Tutor Confirmed Badge */}
      {hasConfirmedTutors && !isPaid && (
        <div
          className="mt-2 text-sm text-emerald-300 bg-emerald-900/30 backdrop-blur-sm px-4 py-2.5 rounded-xl
                        border border-emerald-500/30 flex items-center gap-2 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Tutor Confirmed - Awaiting Payment</span>
        </div>
      )}

      {/* Buttons Section */}
      <div className="mt-5 flex gap-3 relative">
        {showActions ? (
          <>
            {/* Confirm / Cancel Buttons */}
            {!isConfirmed ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm?.();
                }}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold 
                           bg-gradient-to-r from-emerald-600 to-green-600
                           hover:from-emerald-500 hover:to-green-500
                           transition-all border border-emerald-500/20
                           shadow-md hover:shadow-emerald-500/30
                           disabled:opacity-50 disabled:cursor-not-allowed
                           active:scale-95"
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel?.();
                }}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold 
                           bg-gradient-to-r from-red-600 to-red-700
                           hover:from-red-500 hover:to-red-600
                           transition-all border border-red-500/20
                           shadow-md hover:shadow-red-500/30
                           disabled:opacity-50 disabled:cursor-not-allowed
                           active:scale-95"
              >
                {isProcessing ? "Processing..." : "Cancel"}
              </button>
            )}

            {/* View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex-1 py-2.5 rounded-xl text-white font-semibold
                         bg-slate-700 hover:bg-slate-600 transition-all
                         border border-slate-500/20 shadow-md
                         active:scale-95"
            >
              View
            </button>
          </>
        ) : (
          <>
            {isPaid && isMeetingTimeReached ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartMeeting?.();
                }}
                disabled={!isPaid || !isMeetingTimeReached}
                className={`flex-1 py-2.5 rounded-xl text-white font-semibold transition-all shadow-md active:scale-95
                ${
                  isPaid && isMeetingTimeReached
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 border border-emerald-500/20"
                    : "bg-slate-700 text-gray-400 cursor-not-allowed opacity-50"
                }`}
              >
                🎥 Start
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditLesson?.();
                }}
                className="flex-1 py-2.5 rounded-xl text-white font-semibold transition-all
                    bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500
                    border border-slate-500/20 shadow-md active:scale-95"
              >
                Edit
              </button>
            )}

            {/* View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex-1 py-2.5 rounded-xl text-white font-semibold
                         bg-slate-700 hover:bg-slate-600 transition-all
                         border border-slate-500/20 shadow-md active:scale-95"
            >
              View
            </button>

            {/* Chat Button for paid lessons */}
            {isPaid && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartChat?.();
                }}
                className="flex-1 py-2.5 rounded-xl text-white font-semibold 
                          bg-gradient-to-r from-emerald-600 to-green-600 
                          hover:from-emerald-500 hover:to-green-500 
                          transition-all border border-emerald-500/20 
                          shadow-md hover:shadow-emerald-500/30 active:scale-95"
              >
                Chat
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonModel;
