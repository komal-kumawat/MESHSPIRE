import React, { useEffect, useState } from "react";
import Calendar from "../Components/Calendar";
import DaySchedule from "../Components/DaySchedule";
import { getMyLessons } from "../api";
import { payForLesson } from "../api/payment";

const StudentCalendar: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState<any>(null);
  const [dayLessons, setDayLessons] = useState<any>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await getMyLessons();
      setLessons(data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson: any) => {
    setOpenDetails(lesson);
  };

  const handleDayClick = (lessons: any[]) => {
    setDayLessons(lessons);
  };

  const handlePayment = async (tutorData: { tutorId: string }) => {
    try {
      const paymentData = {
        lessonId: openDetails._id,
        tutorId: tutorData.tutorId,
      };

      const url = await payForLesson(paymentData);
      if (url) window.location.href = url;
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      alert(
        error.response?.data?.message ||
          "Failed to initialize payment. Please try again."
      );
    }
  };

  return (
    <div className="bg-black text-white flex flex-col w-full min-h-screen overflow-x-hidden">
      <main className="px-4 sm:px-6 lg:px-10 py-6 flex flex-col gap-6 transition-all duration-300 max-h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg sm:text-2xl font-bold tracking-wide">
            My Class Calendar
          </h2>
          <div className="text-sm text-gray-400 bg-slate-900/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 w-fit">
            Total Lessons: {lessons.length}
          </div>
        </div>

        {/* Calendar / Loading / Empty */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"></div>
            </div>
          </div>
        ) : lessons.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <Calendar
              lessons={lessons}
              onLessonClick={handleLessonClick}
              onDayClick={handleDayClick}
              userRole="student"
            />
          </div>
        ) : (
          <div className="bg-gradient-to-b from-slate-900/80 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center shadow-xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-300 text-lg font-medium mb-2">
              No lessons scheduled
            </p>
            <p className="text-gray-500 text-sm">
              Create your first lesson to get started!
            </p>
          </div>
        )}
      </main>

      {/* Day Schedule */}
      {dayLessons && (
        <DaySchedule
          open={!!dayLessons}
          onClose={() => setDayLessons(null)}
          lessons={dayLessons}
          onLessonClick={handleLessonClick}
          userRole="student"
          handlePayment={handlePayment}
        />
      )}

      {/* Lesson Details Modal */}
      {openDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4 sm:px-6">
          <div className="bg-gradient-to-b from-slate-900/95 to-slate-900/90 backdrop-blur-xl text-white p-6 sm:p-8 rounded-2xl w-full sm:w-[480px] space-y-5 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200 truncate">
                {openDetails.topic}
              </h2>
              {openDetails.subject && (
                <span className="text-xs font-semibold text-white border border-violet-400/40 px-3 py-1 rounded-full bg-violet-500/10 whitespace-nowrap">
                  {openDetails.subject}
                </span>
              )}
            </div>

            {openDetails.subTopic && (
              <p className="text-gray-300 text-sm sm:text-base">
                <span className="font-semibold text-gray-200">Sub Topic:</span>{" "}
                {openDetails.subTopic}
              </p>
            )}

            <div className="space-y-2 bg-slate-800/40 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-white/10">
              <p className="text-gray-300 text-sm">
                <span className="font-semibold text-gray-200">Date:</span>{" "}
                {openDetails.date}
              </p>
              <p className="text-gray-300 text-sm">
                <span className="font-semibold text-gray-200">Time:</span>{" "}
                {openDetails.time}
              </p>
              {openDetails.class && (
                <p className="text-gray-300 text-sm">
                  <span className="font-semibold text-gray-200">Class:</span>{" "}
                  {openDetails.class}
                </p>
              )}
            </div>

            {/* Confirmed Tutors Section */}
            {openDetails.confirmedTutors &&
              openDetails.confirmedTutors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-200">
                    Confirmed Tutors
                  </h3>
                  <div className="space-y-2">
                    {openDetails.confirmedTutors.map((ct: any, idx: number) => {
                      const isTutorPopulated = ct.tutorId && typeof ct.tutorId === "object";
                      const tutorName = isTutorPopulated ? ct.tutorId.name : "Tutor";
                      const tutorId = isTutorPopulated ? ct.tutorId._id : ct.tutorId;

                      if (!tutorId) return null;

                      return (
                        <div
                          key={idx}
                          className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-4 rounded-xl border border-green-500/30 space-y-3"
                        >
                          <p className="text-gray-200 font-semibold">{tutorName}</p>

                          {!openDetails.isPaid && (
                            <button
                              onClick={() => handlePayment({ tutorId })}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all duration-300 px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-500/50"
                            >
                              Pay Now
                            </button>
                          )}

                          {openDetails.isPaid && (
                            <div className="bg-green-900/20 border border-green-500/30 px-4 py-2 rounded-xl text-center">
                              <span className="text-green-400 font-semibold">
                                Payment Completed
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* No Tutors Confirmed Yet */}
            {(!openDetails.confirmedTutors ||
              openDetails.confirmedTutors.length === 0) && (
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <p className="text-gray-400 text-center">
                  No tutors have confirmed yet. Please wait for a tutor to accept your lesson request.
                </p>
              </div>
            )}

            <button
              onClick={() => setOpenDetails(null)}
              className="w-full mt-4 bg-gradient-to-r from-slate-700 to-slate-600 
                         hover:from-slate-600 hover:to-slate-500 transition-all duration-300 
                         px-4 py-3 rounded-xl font-semibold shadow-lg border border-slate-500/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCalendar;
