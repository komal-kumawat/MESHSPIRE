import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface FeaturedCardProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (data: any) => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  open,
  onClose,
  onSchedule,
}) => {
  const classOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const topic = (document.getElementById("topic") as HTMLInputElement).value;
    const subTopic = (document.getElementById("subTopic") as HTMLInputElement)
      .value;
    const subject = (document.getElementById("subject") as HTMLInputElement)
      .value;
    const classValue = (document.getElementById("class") as HTMLSelectElement)
      .value;
    const date = (document.getElementById("date") as HTMLInputElement).value;
    const time = (document.getElementById("time") as HTMLInputElement).value;

    // Validation
    if (!topic || !subject || !classValue || !date || !time) {
      alert("Please fill in all required fields");
      return;
    }

    const lessonData = {
      topic,
      subTopic: subTopic || undefined,
      subject,
      class: classValue,
      date,
      time,
    };

    setIsSubmitting(true);
    try {
      await onSchedule(lessonData);
    } catch (error) {
      console.error("Error scheduling lesson:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="fixed right-0 top-0 h-full w-[420px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl text-white shadow-2xl border-l border-violet-500/20 z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 130, damping: 20 }}
          >
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-6 pb-4 border-b border-violet-500/20 bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                Schedule Your Lesson
              </h2>

              <form className="flex flex-col gap-5">
                <div>
                  <label className="font-semibold text-violet-200 flex items-center gap-2">
                    Topic <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="topic"
                    type="text"
                    required
                    className="w-full p-3 rounded-xl mt-2 bg-slate-800/70 border border-violet-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="e.g., Calculus Basics"
                  />
                </div>

                <div>
                  <label className="font-semibold text-violet-200 flex items-center gap-2">
                    Sub Topic
                  </label>
                  <input
                    id="subTopic"
                    type="text"
                    className="w-full p-3 rounded-xl mt-2 bg-slate-800/70 border border-violet-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="e.g., Derivatives"
                  />
                </div>

                <div>
                  <label className="font-semibold text-violet-200 flex items-center gap-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    className="w-full p-3 rounded-xl mt-2 bg-slate-800/70 border border-violet-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div>
                  <label className="font-semibold text-violet-200 flex items-center gap-2">
                    Class <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="class"
                    required
                    className="w-full p-3 rounded-xl mt-2 bg-slate-800/70 border border-violet-500/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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
                  <label className="font-semibold text-violet-200 flex items-center gap-2">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    className="w-full p-3 rounded-xl mt-2 bg-slate-800/70 border border-violet-500/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="font-semibold text-violet-200 flex items-center gap-2">
                    Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="time"
                    type="time"
                    required
                    className="w-full p-3 rounded-xl mt-2 bg-slate-800/70 border border-violet-500/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 
                           hover:from-violet-500 hover:via-purple-500 hover:to-violet-500 
                           font-bold shadow-xl transition-all duration-300 hover:shadow-violet-500/50 
                           disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Lesson"}
                </button>
              </form>

              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full py-3 mt-4 rounded-xl bg-slate-800/70 border border-violet-500/20 text-gray-200 hover:bg-slate-700/70 transition-all hover:border-violet-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeaturedCard;
