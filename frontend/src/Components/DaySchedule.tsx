import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import type { Lesson } from "./Calendar";

interface DayScheduleProps {
    open: boolean;
    onClose: () => void;
    selectedDate?: string;
    lessons: Lesson[];
    onLessonClick: (lesson: Lesson) => void;
}

const DaySchedule: React.FC<DayScheduleProps> = ({
    open,
    onClose,
    selectedDate,
    lessons,
    onLessonClick,
}) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40 "
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Sidebar */}
                    <motion.div
                        className="
              fixed right-0 top-0 z-50
              h-full w-full sm:w-80
              bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95
               shadow-2xl border-l border-slate-700
              overflow-y-auto
            "
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 130, damping: 20 }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900/80 backdrop-blur">
                            <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                                {selectedDate ? `Classes on ${selectedDate}` : "Day Schedule"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-700/70 rounded-md transition"
                            >
                                <CloseIcon className="text-gray-300" fontSize="small" />
                            </button>
                        </div>

                        {/* Lessons */}
                        <div className="p-3 sm:p-4 space-y-3">
                            {lessons.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center mt-10">
                                    No classes scheduled.
                                </p>
                            ) : (
                                lessons.map((lesson) => (
                                    <motion.div
                                        key={lesson._id}
                                        onClick={() => {
                                            onLessonClick(lesson);
                                            onClose();
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                      p-3 sm:p-4 rounded-lg shadow-md cursor-pointer
                      transition-all flex  justify-between items-center
                      ${lesson.isPaid
                                                ? "bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-500/30"
                                                : "bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-500/30"
                                            }
                    `}
                                    >
                                        <div className="flex flex-col">
                                            <div className="text-white font-semibold text-sm sm:text-base truncate">
                                                {lesson.topic}
                                            </div>
                                            {lesson.studentId?.name && (
                                                <div className="text-gray-400 text-[11px] sm:text-xs mt-1 truncate">
                                                    {lesson.studentId.name}
                                                </div>
                                            )}

                                        </div>


                                        <div className="text-gray-300 text-xs sm:text-sm mt-1 truncate">
                                            {lesson.time}
                                        </div>


                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DaySchedule;
