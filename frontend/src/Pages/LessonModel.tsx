import React from "react";

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
}

const LessonModel: React.FC<LessonModelProps> = ({
  topic,
  subject,
  time,
  onViewDetails,
  studentName,
  showActions = false,
  onConfirm,
  onCancel,
  isConfirmed = false,
  isProcessing = false,
  isPaid = false,
}) => {
  return (
    <div
      className={`backdrop-blur-xl text-white rounded-2xl shadow-2xl px-6 py-5 w-80 space-y-4 transition-all duration-300 hover:scale-[1.02] ${
        isPaid
          ? "bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 border border-green-500/40 hover:shadow-green-500/30 hover:border-green-400/50"
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-violet-500/20 hover:shadow-violet-500/30 hover:border-violet-400/30"
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <h3
          className={`text-xl font-bold tracking-wide bg-clip-text text-transparent leading-tight ${
            isPaid
              ? "bg-gradient-to-r from-green-300 to-emerald-300"
              : "bg-gradient-to-r from-violet-300 to-purple-300"
          }`}
        >
          {topic}
        </h3>
        {subject && (
          <span
            className={`text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm whitespace-nowrap ${
              isPaid
                ? "text-green-200 border border-green-400/40 bg-green-500/10"
                : "text-violet-200 border border-violet-400/40 bg-violet-500/10"
            }`}
          >
            {subject}
          </span>
        )}
      </div>

      {studentName && (
        <div className="flex items-center gap-2 text-sm text-gray-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-white/5">
          <span className={isPaid ? "text-green-400" : "text-violet-400"}>
            👤
          </span>
          <p className="font-medium">{studentName}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-white/5">
        <span className={isPaid ? "text-green-400" : "text-violet-400"}>
          🕒
        </span>
        <p>{time}</p>
      </div>

      {isPaid && (
        <div className="flex items-center gap-2 text-sm text-green-300 bg-green-900/30 px-3 py-2 rounded-lg border border-green-500/30">
          <span className="text-green-400">✓</span>
          <p className="font-semibold">Payment Confirmed</p>
        </div>
      )}

      <div className="pt-2 flex justify-end gap-2">
        {showActions ? (
          <>
            {!isConfirmed ? (
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 
                           hover:from-green-500 hover:to-emerald-500 transition-all duration-300 
                           shadow-lg hover:shadow-green-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
            ) : (
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-600 to-rose-600 
                           hover:from-red-500 hover:to-rose-500 transition-all duration-300 
                           shadow-lg hover:shadow-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Cancel"}
              </button>
            )}
            <button
              onClick={onViewDetails}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 
                         hover:from-violet-500 hover:to-purple-500 transition-all duration-300 
                         shadow-lg hover:shadow-violet-500/50 active:scale-95"
            >
              View Details
            </button>
          </>
        ) : (
          <button
            onClick={onViewDetails}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 
                       hover:from-violet-500 hover:to-purple-500 transition-all duration-300 
                       shadow-lg hover:shadow-violet-500/50 active:scale-95"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonModel;
