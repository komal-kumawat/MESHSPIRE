import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Carousel } from "../Components/ui/Card-Coursel";
import image1 from "../assets/calculus.png";
import image2 from "../assets/algebra.png";
import image3 from "../assets/digital_logic.png";
import image4 from "../assets/probablity.png";
import image5 from "../assets/quantum-computing.png";
import image6 from "../assets/python.png";

const TutorDashboard: React.FC = () => {
  const navigate = useNavigate();

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
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
          Featured Classes
        </h1>
        <div className="max-w-[100vw] overflow-x-hidden scrollbar-hide">
          <Carousel items={cards} />
        </div>

        <div className="mt-10 flex justify-center sm:justify-start">
          <button
            onClick={() => navigate("/update-profile")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-900 via-violet-800 to-violet-900 hover:from-violet-800 hover:to-violet-700 transition-all font-semibold text-sm shadow-lg"
          >
            Update Profile
          </button>
        </div>
      </main>
    </div>
  );
};

export default TutorDashboard;
