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
  onDayClick?: (lessons: Lesson[]) => void;
  userRole?: "student" | "tutor";
}

const Calendar: React.FC<CalendarProps> = ({
  lessons,
  onLessonClick,
  onDayClick,
  userRole = "student",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      year,
      month,
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
    };
  };

  const { year, month, daysInMonth, startingDayOfWeek } =
    getDaysInMonth(currentDate);

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getLessonsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return lessons.filter((lesson) => {
      let lessonDate = lesson.date;

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

  // Empty placeholders for starting day of week
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(
      <div
        key={`empty-${i}`}
        className="bg-slate-900/30 rounded-lg min-h-[80px] sm:min-h-[100px] border border-white/5"
      />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const lessonsOnDay = getLessonsForDate(day);

    days.push(
      <div
        key={day}
        onClick={() => onDayClick?.(lessonsOnDay)}
        className={`bg-gradient-to-b from-slate-900/60 to-slate-900/30 rounded-xl p-1 sm:p-2 min-h-[80px] sm:min-h-[100px] flex flex-col border ${
          isToday(day) ? "border-emerald-500/50 ring-1 ring-emerald-500/20" : "border-slate-700"
        }`}
      >
        <div
          className={`text-[11px] sm:text-sm font-semibold mb-1 ${
            isToday(day) ? "text-emerald-400" : "text-gray-300"
          }`}
        >
          {day}
        </div>

        {/* Lessons as small boxes */}
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          {lessonsOnDay.slice(0, 2).map((lesson) => (
            <div
              key={lesson._id}
              onClick={(e) => {
                e.stopPropagation();
                onLessonClick(lesson);
              }}
              className={`text-[9px] sm:text-[10px] truncate rounded-md px-1 py-0.5 flex items-center justify-center font-semibold cursor-pointer
                ${
                  lesson.isPaid
                    ? "bg-gradient-to-r from-emerald-900/40 to-green-900/40 text-white"
                    : "bg-gradient-to-r from-violet-900/40 to-purple-900/40 text-white"
                }`}
              style={{ minHeight: "18px" }}
            >
              {lesson.topic}
            </div>
          ))}

          {/* +N more if more than 2 lessons */}
          {lessonsOnDay.length > 2 && (
            <div className="text-[9px] sm:text-[10px] text-emerald-400 font-medium text-center">
              +{lessonsOnDay.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return days;
};




  return (
    <div className="w-full overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-slate-900/80 via-emerald-900/20 to-slate-900/80 p-3 sm:p-4 rounded-xl border border-white/10 shadow-lg">
        <button
          onClick={previousMonth}
          className="p-1.5 sm:p-2 rounded-lg border border-white/5 hover:border-emerald-500/30"
        >
          <ChevronLeftIcon className="text-gray-300" fontSize="small" />
        </button>

        <h2 className="text-lg sm:text-2xl font-bold text-white">
          {monthNames[month]} {year}
        </h2>

        <button
          onClick={nextMonth}
          className="p-1.5 sm:p-2 rounded-lg border border-white/5 hover:border-emerald-500/30"
        >
          <ChevronRightIcon className="text-gray-300" fontSize="small" />
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-400 text-[11px] sm:text-sm py-1 sm:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-500/30 rounded-md" />
          <span className="text-[10px] sm:text-xs text-gray-400">
            Pending Payment
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-r from-emerald-900/40 to-green-900/40 border border-emerald-500/30 rounded-md" />
          <span className="text-[10px] sm:text-xs text-gray-400">
            Confirmed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-emerald-500 rounded-md" />
          <span className="text-[10px] sm:text-xs text-gray-400">
            Today
          </span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
