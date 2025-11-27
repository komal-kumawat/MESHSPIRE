import React from "react";

interface LessonModelProps {
  topic: string;
  subject: string;
  time: string;
  onViewDetails: () => void;
}

const LessonModel: React.FC<LessonModelProps> = ({ topic, subject, time, onViewDetails }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/10 px-5 py-4 w-72 space-y-3">
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold tracking-wide">{topic}</h3>
        {subject && (
          <span className="text-[10px] font-medium text-white border border-white/30 px-2 py-[2px] rounded-full bg-white/5 shadow-sm">
            {subject}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-300">Scheduled: {time}</p>

      <div className="pt-2 flex justify-end">
        <button
          onClick={onViewDetails}
          className="px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-violet-800 to-violet-900 
                     hover:from-violet-700 hover:to-violet-800 transition shadow-md active:scale-95"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default LessonModel;
