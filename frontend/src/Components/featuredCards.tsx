import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface FeaturedCardProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (data: any) => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ open, onClose, onSchedule }) => {
  // You can define the classes available in the dropdown
  const classOptions = Array.from({ length: 12 }, (_, i) => i + 1); // Classes 1 to 12

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sliding Panel */}
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
                <div>
                  <label className="font-medium text-gray-300">Topic</label>
                  <input
                    id="topic"
                    type="text"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
                    placeholder="Enter topic name"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-300">Sub Topic</label>
                  <input
                    id="subTopic"
                    type="text"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
                    placeholder="Enter sub topic"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-300">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-700"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-300">Class</label>
                  <select
                    id="class"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-700"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Class
                    </option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        Class {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-gray-300">Date</label>
                  <input
                    id="date"
                    type="date"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-700"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-300">Time</label>
                  <input
                    id="time"
                    type="time"
                    className="w-full p-3 rounded-xl mt-1 bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-700"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const lessonData = {
                      topic: (document.getElementById("topic") as HTMLInputElement).value,
                      subTopic: (document.getElementById("subTopic") as HTMLInputElement).value,
                      subject: (document.getElementById("subject") as HTMLInputElement).value,
                      class: (document.getElementById("class") as HTMLSelectElement).value,
                      date: (document.getElementById("date") as HTMLInputElement).value,
                      time: (document.getElementById("time") as HTMLInputElement).value,
                    };
                    onSchedule(lessonData);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 font-semibold shadow-xl transition"
                >
                  Schedule
                </button>
              </form>

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
