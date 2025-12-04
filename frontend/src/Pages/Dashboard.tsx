import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, Card } from "../Components/ui/Card-Coursel";
import FeaturedCard from "../Components/featuredCards";
import LessonModel from "../Components/LessonModel";
import LessonCarousel from "../Components/LessonCarousel";
import { createLesson, getMyLessons } from "../api";
import image1 from "../assets/calculus.png";
import image2 from "../assets/algebra.png";
import image3 from "../assets/digital_logic.png";
import image4 from "../assets/probablity.png";
import image5 from "../assets/quantum-computing.png";
import image6 from "../assets/python.png";
import { payForLesson } from "../api/payment";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [openCard, setOpenCard] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [openDetails, setOpenDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Separate paid and unpaid lessons
  const unpaidLessons = lessons.filter((lesson) => !lesson.isPaid);
  const paidLessons = lessons.filter((lesson) => lesson.isPaid);

  useEffect(() => {
    fetchLessons();

    // Refresh lessons when navigating back from payment
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLessons();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", fetchLessons);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", fetchLessons);
    };
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

  const handleScheduleLesson = async (lessonData: any) => {
    try {
      await createLesson(lessonData);
      await fetchLessons(); // Refresh the list
      setOpenCard(false);
    } catch (error) {
      console.error("Error creating lesson:", error);
      alert("Failed to schedule lesson. Please try again.");
    }
  };

  const handleStartMeeting = (lesson: any) => {
    const randomId = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${randomId}`, {
      state: {
        title: lesson.topic,
        category: lesson.subject,
        rating: 5,
        autoSendVideo: true,
      },
    });
  };

  const meetings = [
    {
      id: 1,
      theoremName: "Calculus",
      teacherName: "Mr. Sharma",
      imageUrl: image1,
      rating: 4.5,
    },
    {
      id: 2,
      theoremName: "Algebra",
      teacherName: "Ms. Gupta",
      imageUrl: image2,
      rating: 4,
    },
    {
      id: 3,
      theoremName: "Digital Logic",
      teacherName: "Dr. Mehta",
      imageUrl: image3,
      rating: 3.5,
    },
    {
      id: 4,
      theoremName: "Probability",
      teacherName: "Mr. Singh",
      imageUrl: image4,
      rating: 5,
    },
    {
      id: 5,
      theoremName: "Quantum Computing",
      teacherName: "Ms. Verma",
      imageUrl: image5,
      rating: 4.2,
    },
    {
      id: 6,
      theoremName: "Python Programming",
      teacherName: "Ms. Verma",
      imageUrl: image6,
      rating: 4.8,
    },
  ];

  const cards = meetings.map((m, index) => (
    <Card
      key={index}
      index={index}
      card={{
        src: m.imageUrl,
        title: m.theoremName,
        category: `Instructor: ${m.teacherName}`,
        rating: m.rating,
        content: (
          <p className="text-gray-300 text-sm sm:text-base mt-1">
            Learn about {m.theoremName} with {m.teacherName}.
          </p>
        ),
      }}
    />
  ));

  return (
    <div className="bg-black text-white flex flex-col w-full overflow-x-hidden min-h-screen">
      <main className="px-4 sm:px-8 py-10 flex flex-col gap-10 transition-all duration-300">
        {/* Schedule Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-wide">
            My Scheduled Lessons
          </h2>
          <button
            onClick={() => setOpenCard(true)}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 via-violet-700 to-purple-600 
                     hover:from-violet-500 hover:via-violet-600 hover:to-purple-500 
                     rounded-xl font-semibold shadow-lg transition-all duration-300 
                     hover:shadow-violet-500/50 hover:scale-105 active:scale-95
                     border border-violet-500/20"
          >
            + Schedule New Lesson
          </button>
        </div>

        {/* Unpaid Lesson Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : unpaidLessons.length > 0 ? (
          <LessonCarousel>
            {unpaidLessons.map((lesson, index) => (
              <LessonModel
                key={lesson._id || index}
                topic={lesson.topic}
                subject={lesson.subject}
                time={`${lesson.date} • ${lesson.time}`}
                onViewDetails={() => setOpenDetails(lesson)}
                isPaid={false}
                date={lesson.date}
                lessonTime={lesson.time}
              />
            ))}
          </LessonCarousel>
        ) : (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-gray-400 text-lg">
              No unpaid lessons. Create your first lesson!
            </p>
          </div>
        )}

        {/* Confirmed Classes Section */}
        {!loading && paidLessons.length > 0 && (
          <>
            <div className="flex justify-between items-center mt-8">
              <h2 className="text-2xl font-bold tracking-wide">
                Confirmed Classes
              </h2>
            </div>
            <LessonCarousel>
              {paidLessons.map((lesson, index) => (
                <LessonModel
                  key={lesson._id || index}
                  topic={lesson.topic}
                  subject={lesson.subject}
                  time={`${lesson.date} • ${lesson.time}`}
                  onViewDetails={() => setOpenDetails(lesson)}
                  isPaid={true}
                  date={lesson.date}
                  lessonTime={lesson.time}
                  onStartMeeting={() => handleStartMeeting(lesson)}
                />
              ))}
            </LessonCarousel>
          </>
        )}

        <h1 className="text-3xl font-bold tracking-wide text-center sm:text-left mt-8">
          Explore Courses
        </h1>

        <div className="max-w-[100vw] overflow-x-hidden">
          <Carousel items={cards} />
        </div>
      </main>

      {openCard && (
        <FeaturedCard
          open={openCard}
          onClose={() => setOpenCard(false)}
          onSchedule={handleScheduleLesson}
        />
      )}

      {openDetails && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
          onClick={() => setOpenDetails(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-2xl w-full sm:w-[480px] space-y-5 shadow-2xl border border-violet-500/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {openDetails.topic}
              </h2>
              {openDetails.subject && (
                <span className="text-xs font-medium text-white border border-violet-400/40 px-3 py-1 rounded-full bg-violet-500/10">
                  {openDetails.subject}
                </span>
              )}
            </div>

            {openDetails.subTopic && (
              <p className="text-gray-300 text-base">
                <span className="font-semibold text-violet-300">
                  Sub Topic:
                </span>{" "}
                {openDetails.subTopic}
              </p>
            )}

            <div className="space-y-2 bg-slate-800/50 p-4 rounded-xl border border-white/5">
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <span className="text-violet-400"></span>
                <span className="font-semibold">Date:</span> {openDetails.date}
              </p>

              <p className="text-gray-300 text-sm flex items-center gap-2">
                <span className="text-violet-400"></span>
                <span className="font-semibold">Time:</span> {openDetails.time}
              </p>

              {openDetails.class && (
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="text-violet-400"></span>
                  <span className="font-semibold">Class:</span>{" "}
                  {openDetails.class}
                </p>
              )}
            </div>

            {/* Confirmed Tutors Section */}
            {openDetails.confirmedTutors &&
              openDetails.confirmedTutors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-violet-300">
                    Confirmed Tutors
                  </h3>
                  <div className="space-y-2">
                    {openDetails.confirmedTutors.map(
                      (confirmedTutor: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-4 rounded-xl border border-green-500/30 space-y-3"
                        >
                          <p className="text-gray-200 font-semibold">
                            {confirmedTutor.tutorId?.name ||
                              confirmedTutor.tutorId ||
                              "Unknown Tutor"}
                          </p>

                          {confirmedTutor.tutorId?.email && (
                            <p className="text-gray-400 text-sm">
                              {confirmedTutor.tutorId.email}
                            </p>
                          )}

                          {confirmedTutor.confirmedAt && (
                            <p className="text-gray-400 text-xs">
                              Confirmed:{" "}
                              {new Date(
                                confirmedTutor.confirmedAt
                              ).toLocaleString()}
                            </p>
                          )}

                          {!openDetails.isPaid && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                              <button
                                onClick={async () => {
                                  console.log("Initiating payment...");
                                  try {
                                    const url = await payForLesson({
                                      tutorId: confirmedTutor.tutorId._id,
                                      lessonId: openDetails._id,
                                    });
                                    window.location.href = url; // redirect to Stripe
                                  } catch (error) {
                                    console.error("Payment Error:", error);
                                    alert("Payment failed. Try again later.");
                                  }
                                }}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500
                                    transition-all px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-green-500/50
                                    active:scale-95 text-white"
                              >
                                Pay & Confirm
                              </button>

                              <a
                                href={`${window.location.origin}/tutor/${confirmedTutor.tutorId._id}`}
                                target="_blank"
                              >
                                <button
                                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500
                                transition-all px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-violet-500/50
                                active:scale-95 text-white"
                                >
                                  Teacher Details
                                </button>
                              </a>
                            </div>
                          )}

                          {openDetails.isPaid && (
                            <div className="pt-1">
                              <a
                                href={`${window.location.origin}/tutor/${confirmedTutor.tutorId._id}`}
                                target="_blank"
                              >
                                <button
                                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500
                                       transition-all px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-violet-500/50
                                       active:scale-95 text-white"
                                >
                                  Teacher Details
                                </button>
                              </a>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* No Tutors Confirmed Yet */}
            {(!openDetails.confirmedTutors ||
              openDetails.confirmedTutors.length === 0) && (
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <p className="text-gray-400 text-center">
                  No tutors have confirmed yet. Please wait for a tutor to
                  accept your lesson request.
                </p>
              </div>
            )}

            <button
              onClick={() => setOpenDetails(null)}
              className="w-full mt-4 bg-gradient-to-r from-violet-600 to-purple-600 
                       hover:from-violet-500 hover:to-purple-500 transition-all duration-300 
                       px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-violet-500/50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
