import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface Lesson {
  _id: string;
  topic: string;
  subject: string;
  subTopic?: string;
  class: string;
  date: string;
  time: string;
  status: string;
  isPaid: boolean;
  studentId?: { name: string; email: string };
  confirmedTutors?: any[];
}

interface CalendarProps {
  lessons: Lesson[];
  onLessonClick: (lesson: Lesson) => void;
  userRole?: "student" | "tutor";
}

const Calendar: React.FC<CalendarProps> = ({
  lessons,
  onLessonClick,
  userRole = "student",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentDate);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getLessonsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return lessons.filter((lesson) => {
      // Parse the lesson date (assuming format: "YYYY-MM-DD" or "DD/MM/YYYY")
      let lessonDate = lesson.date;

      // Convert DD/MM/YYYY to YYYY-MM-DD if needed
      if (lessonDate.includes("/")) {
        const [d, m, y] = lessonDate.split("/");
        lessonDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }

      return lessonDate === dateStr;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="bg-gradient-to-b from-slate-900/40 to-slate-900/20 border border-white/5 rounded-lg p-2 min-h-[90px]"
        />
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const lessonsOnDay = getLessonsForDate(day);
      const hasLessons = lessonsOnDay.length > 0;

      days.push(
        <div
          key={day}
          className={`bg-gradient-to-b from-slate-900/60 to-slate-900/30 backdrop-blur-sm border rounded-xl p-2 min-h-[90px] transition-all hover:from-slate-800/70 hover:to-slate-800/40
            ${
              isToday(day)
                ? "border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10"
                : "border-white/10"
            }
            ${hasLessons ? "cursor-pointer" : ""}`}
        >
          <div
            className={`text-sm font-semibold mb-1.5 ${
              isToday(day) ? "text-emerald-400" : "text-gray-300"
            }`}
          >
            {day}
          </div>

          {lessonsOnDay.length > 0 && (
            <div className="space-y-1">
              {lessonsOnDay.slice(0, 2).map((lesson) => (
                <div
                  key={lesson._id}
                  onClick={() => onLessonClick(lesson)}
                  className={`text-xs p-1.5 rounded-lg cursor-pointer transition-all hover:scale-[1.02] shadow-md
                    ${
                      lesson.isPaid
                        ? "bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-500/30 hover:from-emerald-800/50 hover:to-green-800/50"
                        : "bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-500/30 hover:from-violet-800/50 hover:to-purple-800/50"
                    }`}
                >
                  <div className="font-semibold truncate text-white">
                    {lesson.topic}
                  </div>
                  <div className="text-gray-300 truncate text-[10px]">
                    {lesson.time}
                  </div>
                  {userRole === "tutor" && lesson.studentId?.name && (
                    <div className="text-gray-400 truncate text-[9px]">
                      {lesson.studentId.name}
                    </div>
                  )}
                </div>
              ))}
              {lessonsOnDay.length > 2 && (
                <div className="text-[10px] text-emerald-400 font-medium text-center py-0.5">
                  +{lessonsOnDay.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-slate-900/80 via-emerald-900/20 to-slate-900/80 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-lg">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-green-600/20 rounded-lg transition-all duration-300 border border-white/5 hover:border-emerald-500/30"
        >
          <ChevronLeftIcon className="text-gray-300" />
        </button>

        <h2 className="text-2xl font-bold text-white">
          {monthNames[month]} {year}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-green-600/20 rounded-lg transition-all duration-300 border border-white/5 hover:border-emerald-500/30"
        >
          <ChevronRightIcon className="text-gray-300" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-400 text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-500/30 rounded-md"></div>
          <span className="text-xs text-gray-400">Pending Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-500/30 rounded-md"></div>
          <span className="text-xs text-gray-400">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 rounded-md"></div>
          <span className="text-xs text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
