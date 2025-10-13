import React from "react";
import { Carousel, Card } from "../Components/ui/Card-Coursel";
import image1 from "../assets/calculus.png";
import image2 from "../assets/algebra.png";
import image3 from "../assets/digital_logic.png";
import image4 from "../assets/probablity.png";
import image5 from "../assets/quantum-computing.png";
import image6 from "../assets/python.png";

const Dashboard: React.FC = () => {
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
          <div>
            <p className="text-gray-700 text-sm sm:text-base">
              Learn about {m.theoremName} with {m.teacherName}. Dive into its
              proofs, applications, and visual understanding.
            </p>
          </div>
        ),
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-black text-white flex flex-col w-full overflow-x-hidden">
      <main className="px-4 sm:px-6 py-6 sm:py-8 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl text-white mb-6 font-semibold text-center sm:text-left">
          Your Next Lessons
        </h1>

        {/* Carousel */}
        <div className="w-full overflow-x-hidden">
          <Carousel items={cards} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
