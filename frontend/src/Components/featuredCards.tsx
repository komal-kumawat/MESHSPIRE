import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface FeaturedCardProps {
  open: boolean;
  onClose: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dim Background */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Slide-In Modal */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[400px] bg-slate-900/90 backdrop-blur-xl text-white shadow-2xl border-l border-white/10 z-50 overflow-y-auto rounded-l-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 130, damping: 20 }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-white/10">
                Schedule Your Lesson
              </h2>

              <form className="flex flex-col gap-5">

                {/* Topic */}
                <div>
                  <label className="font-medium text-gray-300">Topic</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
                    placeholder="Enter topic name"
                  />
                </div>

                {/* Sub Topic */}
                <div>
                  <label className="font-medium text-gray-300">Sub Topic</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
                    placeholder="Enter sub topic"
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="font-medium text-gray-300">Class</label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
                    placeholder="Class number"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="font-medium text-gray-300">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-700"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="font-medium text-gray-300">Time</label>
                  <input
                    type="time"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-700"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="font-medium text-gray-300">Duration (minutes)</label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
                    placeholder="e.g. 45"
                  />
                </div>

                {/* Schedule Button */}
                <button
                  type="button"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 font-semibold shadow-xl transition"
                >
                  Schedule
                </button>
              </form>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-3 mt-4 rounded-xl bg-slate-800 border border-white/10 text-gray-200 hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeaturedCard;
