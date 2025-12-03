import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Carousel } from "../Components/ui/Card-Coursel";
import LessonModel from "../Components/LessonModel";
import { getRelevantLessons, confirmLesson, cancelLesson } from "../api";
import { useAuth } from "../Context/AuthContext";
import image1 from "../assets/calculus.png";
import image2 from "../assets/algebra.png";
import image3 from "../assets/digital_logic.png";
import image4 from "../assets/probablity.png";
import image5 from "../assets/quantum-computing.png";
import image6 from "../assets/python.png";

const TutorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [relevantLessons, setRelevantLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState<any>(null);
  const [processingLessonId, setProcessingLessonId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchRelevantLessons();
  }, []);

  const fetchRelevantLessons = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching relevant lessons...");
      const data = await getRelevantLessons();
      console.log("✅ Relevant lessons received:", data);
      console.log("   Lessons count:", data.length);
      if (data.length > 0) {
        console.log("   First lesson:", data[0]);
      }
      setRelevantLessons(data);
    } catch (error: any) {
      console.error("❌ Error fetching relevant lessons:", error);
      if (error.response) {
        console.error("   Response status:", error.response.status);
        console.error("   Response data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLesson = async (lessonId: string) => {
    try {
      setProcessingLessonId(lessonId);
      await confirmLesson(lessonId);
      // Refresh the lessons list
      await fetchRelevantLessons();
    } catch (error: any) {
      console.error("❌ Error confirming lesson:", error);
      alert(
        error.response?.data?.message ||
        "Failed to confirm lesson. Please try again."
      );
    } finally {
      setProcessingLessonId(null);
    }
  };

  const handleCancelLesson = async (lessonId: string) => {
    try {
      setProcessingLessonId(lessonId);
      await cancelLesson(lessonId);
      // Remove the lesson from the list immediately
      setRelevantLessons((prev) =>
        prev.filter((lesson) => lesson._id !== lessonId)
      );
    } catch (error: any) {
      console.error("❌ Error cancelling lesson:", error);
      alert(
        error.response?.data?.message ||
        "Failed to cancel lesson. Please try again."
      );
    } finally {
      setProcessingLessonId(null);
    }
  };

  const isLessonConfirmedByCurrentUser = (lesson: any): boolean => {
    if (!userId) return false;
    return lesson.confirmedTutors?.some(
      (ct: any) => ct.tutorId?._id === userId || ct.tutorId === userId
    );
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

  // Separate paid and unpaid lessons
  const unpaidLessons = relevantLessons.filter((lesson) => !lesson.isPaid);
  const paidLessons = relevantLessons.filter((lesson) => lesson.isPaid);

  // Featured class topics (sample static data)
  const featured = [
    {
      title: "Intro to Calculus",
      icon: image1,
      category: "Foundations",
      description: "Limits, derivatives & intuition for rate of change.",
      rating: 4.7,
    },
    {
      title: "Algebra Essentials",
      icon: image2,
      category: "Core Skills",
      description: "Equations, factoring & problem‑solving patterns.",
      rating: 4.5,
    },
    {
      title: "Digital Logic Basics",
      icon: image3,
      category: "CS Concepts",
      description: "Binary systems, gates & simple circuit reasoning.",
      rating: 4.3,
    },
    {
      title: "Probability Concepts",
      icon: image4,
      category: "Statistics",
      description: "Random variables, events & everyday applications.",
      rating: 4.9,
    },
    {
      title: "Quantum Computing Intro",
      icon: image5,
      category: "Advanced",
      description: "Qubits, superposition & why it matters.",
      rating: 4.6,
    },
    {
      title: "Python for Problem Solving",
      icon: image6,
      category: "Programming",
      description: "Clean coding patterns & algorithmic thinking.",
      rating: 4.8,
    },
  ];

  const cards = featured.map((c, i) => (
    <Card
      key={i}
      index={i}
      card={{
        src: c.icon,
        title: c.title,
        category: c.category,
        rating: c.rating,
        content: (
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {c.description}
          </p>
        ),
      }}
    />
  ));

  return (
    <div className="bg-black text-white flex flex-col w-full overflow-x-hidden min-h-screen">
      <main className="px-4 sm:px-6 py-6 sm:py-8">
        {/* Relevant Classes Section */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
            Relevant Classes
          </h1>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          ) : unpaidLessons.length > 0 ? (
            <div className="flex gap-4 flex-wrap pb-3">
              {unpaidLessons.map((lesson, index) => (
                <LessonModel
                  key={lesson._id || index}
                  topic={lesson.topic}
                  subject={lesson.subject}
                  time={`${lesson.date} • ${lesson.time}`}
                  studentName={lesson.studentId?.name || "Unknown Student"}
                  onViewDetails={() => setOpenDetails(lesson)}
                  showActions={true}
                  onConfirm={() => handleConfirmLesson(lesson._id)}
                  onCancel={() => handleCancelLesson(lesson._id)}
                  isConfirmed={isLessonConfirmedByCurrentUser(lesson)}
                  isProcessing={processingLessonId === lesson._id}
                  isPaid={false}
                  date={lesson.date}
                  lessonTime={lesson.time}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-400 text-lg">
                No relevant lessons found. Students haven't created any lessons
                matching your subjects yet.
              </p>
            </div>
          )}
        </div>

        {/* Confirmed Classes Section for Tutors */}
        {!loading && paidLessons.length > 0 && (
          <div className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
              Confirmed Classes ✓
            </h1>
            <div className="flex gap-4 flex-wrap pb-3">
              {paidLessons.map((lesson, index) => (
                <LessonModel
                  key={lesson._id || index}
                  topic={lesson.topic}
                  subject={lesson.subject}
                  time={`${lesson.date} • ${lesson.time}`}
                  studentName={lesson.studentId?.name || "Unknown Student"}
                  onViewDetails={() => setOpenDetails(lesson)}
                  showActions={false}
                  isPaid={true}
                  date={lesson.date}
                  lessonTime={lesson.time}
                  onStartMeeting={() => handleStartMeeting(lesson)}
                />
              ))}
            </div>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
          Featured Classes
        </h1>
        <div className="max-w-[100vw] overflow-x-hidden scrollbar-hide">
          <Carousel items={cards} />
        </div>

        <div className="mt-10 flex justify-center sm:justify-start">
          <a
            href={`${window.location.origin}/tutor/${userId}`}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 transition-all font-semibold text-sm shadow-lg"
            target="_blank"
          >
            Share Public Profile
          </a>
        </div>
      </main>

      {openDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-2xl w-full sm:w-[480px] space-y-5 shadow-2xl border border-violet-500/20">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {openDetails.topic}
              </h2>
              {openDetails.subject && (
                <span className="text-xs font-semibold text-violet-200 border border-violet-400/40 px-3 py-1 rounded-full bg-violet-500/10">
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
              <p className="text-gray-300">
                <span className="font-semibold text-violet-300">Student:</span>{" "}
                {openDetails.studentId?.name || "Unknown"}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-violet-300">Class:</span>{" "}
                {openDetails.class}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-violet-300">Date:</span>{" "}
                {openDetails.date}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-violet-300">Time:</span>{" "}
                {openDetails.time}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-violet-300">Status:</span>{" "}
                <span className={`font-semibold ${openDetails.isPaid
                    ? "text-green-400"
                    : isLessonConfirmedByCurrentUser(openDetails)
                      ? "text-green-500"
                      : "text-red-400"
                  }`}
                >
                  {openDetails.isPaid
                    ? "Paid & Scheduled"
                    : isLessonConfirmedByCurrentUser(openDetails)
                      ? "Confirmed (awaiting payment)"
                      : "Not Confirmed yet "}
                </span>
              </p>

            </div>

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

export default TutorDashboard;
