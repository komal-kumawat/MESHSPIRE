import React, { useState, useEffect } from "react";
import { Carousel, Card } from "../Components/ui/Card-Coursel";
import FeaturedCard from "../Components/featuredCards";
import LessonModel from "./LessonModel";
import image1 from "../assets/calculus.png";
import image2 from "../assets/algebra.png";
import image3 from "../assets/digital_logic.png";
import image4 from "../assets/probablity.png";
import image5 from "../assets/quantum-computing.png";
import image6 from "../assets/python.png";

const Dashboard: React.FC = () => {
  const [openCard, setOpenCard] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [openDetails, setOpenDetails] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("scheduledLessons");
    if (saved) setLessons(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("scheduledLessons", JSON.stringify(lessons));
  }, [lessons]);

  const removeLesson = (index: number) => {
    setLessons(prev => prev.filter((_, i) => i !== index));
  };

  const meetings = [
    { id: 1, theoremName: "Calculus", teacherName: "Mr. Sharma", imageUrl: image1, rating: 4.5 },
    { id: 2, theoremName: "Algebra", teacherName: "Ms. Gupta", imageUrl: image2, rating: 4 },
    { id: 3, theoremName: "Digital Logic", teacherName: "Dr. Mehta", imageUrl: image3, rating: 3.5 },
    { id: 4, theoremName: "Probability", teacherName: "Mr. Singh", imageUrl: image4, rating: 5 },
    { id: 5, theoremName: "Quantum Computing", teacherName: "Ms. Verma", imageUrl: image5, rating: 4.2 },
    { id: 6, theoremName: "Python Programming", teacherName: "Ms. Verma", imageUrl: image6, rating: 4.8 },
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

        <div className="flex gap-4 flex-wrap sm:flex-nowrap overflow-x-auto pb-3">
          {lessons.map((lesson, index) => (
            <LessonModel
              key={index}
              topic={lesson.topic}
              subject={lesson.subject}
              time={`${lesson.date} • ${lesson.time}`}
              onViewDetails={() => setOpenDetails(lesson)}
              onRemove={() => removeLesson(index)}
            />
          ))}
        </div>

        <button
          onClick={() => setOpenCard(true)}
          className="self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                     hover:from-blue-500 hover:to-blue-600 rounded-xl font-medium shadow-lg transition"
        >
          Schedule New Lesson
        </button>

        <h1 className="text-3xl font-bold tracking-wide text-center sm:text-left">
          Your Next Lessons
        </h1>

        <div className="max-w-[100vw] overflow-x-hidden">
          <Carousel items={cards} />
        </div>
      </main>

      {openCard && (
        <FeaturedCard
          open={openCard}
          onClose={() => setOpenCard(false)}
          onSchedule={(data: any) => {
            setLessons(prev => [...prev, data]);
            setOpenCard(false);
          }}
        />
      )}

      {openDetails && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl w-full sm:w-[420px] space-y-4 shadow-2xl border border-white/10">
            <h2 className="text-2xl font-bold">{openDetails.topic}</h2>

            <p className="text-gray-300 text-sm">
              Time: {openDetails.date} • {openDetails.time}
            </p>

            {openDetails.class && (
              <p className="text-gray-300 text-sm">Class: {openDetails.class}</p>
            )}

            {openDetails.duration && (
              <p className="text-gray-300 text-sm">Duration: {openDetails.duration} minutes</p>
            )}

            <button
              onClick={() => setOpenDetails(null)}
              className="w-full mt-2 bg-violet-800 hover:bg-violet-700 transition px-4 py-2 rounded-lg"
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
