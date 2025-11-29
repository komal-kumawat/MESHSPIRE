import React from "react";

interface LessonModelProps {
  topic: string;
  subject: string;
  time: string;
  onViewDetails: () => void;
}

const LessonModel: React.FC<LessonModelProps> = ({
  topic,
  subject,
  time,
  onViewDetails,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-violet-500/20 px-6 py-5 w-80 space-y-4 hover:shadow-violet-500/30 hover:border-violet-400/30 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-xl font-bold tracking-wide bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent leading-tight">
          {topic}
        </h3>
        {subject && (
          <span className="text-[11px] font-semibold text-violet-200 border border-violet-400/40 px-3 py-1 rounded-full bg-violet-500/10 shadow-sm whitespace-nowrap">
            {subject}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-white/5">
        <span className="text-violet-400"></span>
        <p>{time}</p>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={onViewDetails}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 
                     hover:from-violet-500 hover:to-purple-500 transition-all duration-300 
                     shadow-lg hover:shadow-violet-500/50 active:scale-95"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default LessonModel;
