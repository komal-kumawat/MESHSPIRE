"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Icon } from "@/components/ui/Icon";
import { Timeline } from "@/components/ui/Timeline";
import AnimatedFlowSVG from "../ui/AnimatedFlow";

const timelineData = (isDark: boolean) => [
  {
    title: "Signup and create account",
    content: (
      <p
        className={`text-sm md:text-[20px] leading-[1.9] max-w-md transition-colors duration-500 ${
          isDark ? "text-white/90" : "text-black/90"
        }`}
      >
        Signup and create a student profile to find the best tutors for you. No
        payments, free signup. Access all the topics you want to learn.
      </p>
    ),
  },
  {
    title: "Enter the topic you want to learn",
    content: (
      <p
        className={`text-sm md:text-[20px] leading-[1.9] max-w-md transition-colors duration-500 ${
          isDark ? "text-white/90" : "text-black/90"
        }`}
      >
        Select the tutor you want to learn from. We have wide range of tutors
        which will match your learning style.
      </p>
    ),
  },
  {
    title: "Connect to your tutor instantly",
    content: (
      <p
        className={`text-sm md:text-[20px] leading-[1.9] max-w-md transition-colors duration-500 ${
          isDark ? "text-white/90" : "text-black/90"
        }`}
      >
        Instantly connect to your tutor and learn. You getting it right is our
        responsibility. Solve instant assignments, give tests and a lot more.
      </p>
    ),
  },
];

const Content = () => {
  const { theme } = useTheme();
  const [timelineHeight, setTimelineHeight] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (timelineRef.current) setTimelineHeight(timelineRef.current.offsetHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const isDark = theme === "dark";

  return (
   <section
  id="services"
  className={`py-16 px-6 mt-32  flex flex-col items-center justify-center mx-4 rounded-3xl  gap-24 overflow-x-hidden transition-colors duration-700 ${
    isDark
      ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-xl"
      : "bg-gradient-to-br from-white via-gray-50 to-gray-200 backdrop-blur-sm shadow-lg"

  }`}
>

      {/* Section Header */}
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <div
          className={`border-2 flex flex-col items-center md:items-start mx-auto p-8 max-w-xs md:max-w-none relative rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-700 ${
            isDark ? "border-white/20 bg-black/20" : "border-black/20 bg-white/50"
          } hover:scale-105`}
        >
          <Icon
            className={`absolute h-6 w-6 -top-4 -left-4 transition-colors duration-500 ${
              isDark ? "text-white/70" : "text-black/70"
            }`}
          />
          <Icon
            className={`absolute h-6 w-6 -bottom-4 -left-4 transition-colors duration-500 ${
              isDark ? "text-white/70" : "text-black/70"
            }`}
          />
          <Icon
            className={`absolute h-6 w-6 -top-4 -right-4 transition-colors duration-500 ${
              isDark ? "text-white/70" : "text-black/70"
            }`}
          />
          <Icon
            className={`absolute h-6 w-6 -bottom-4 -right-4 transition-colors duration-500 ${
              isDark ? "text-white/70" : "text-black/70"
            }`}
          />
          <h2
            className={`text-3xl md:text-5xl font-khula font-extrabold text-center md:text-left transition-colors duration-700 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Learning made easy
          </h2>
        </div>
      </div>

      {/* Timeline + Animated SVG */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-28 w-full max-w-7xl">
        {/* Timeline */}
        <div ref={timelineRef} className="hidden md:flex w-full md:w-1/2">
          <Timeline data={timelineData(isDark)} hoverEffect scaleOnHover />
        </div>

        {/* Animated Flow */}
        <div
          className="hidden md:flex w-full md:w-1/2 justify-center items-start relative"
          style={{
            height: timelineHeight ? `${timelineHeight - 180}px` : "500px",
          }}
        >
          <div
            style={{
              height: timelineHeight ? `${timelineHeight - 180}px` : "500px",
              width: "100%",
            }}
            className="animate-float hover:scale-105 transition-transform duration-700"
          >
            <AnimatedFlowSVG  />
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="flex md:hidden flex-col gap-12 w-full">
          <Timeline data={timelineData(isDark)} hoverEffect scaleOnHover />
        </div>
      </div>
    </section>
  );
};

export default Content;
