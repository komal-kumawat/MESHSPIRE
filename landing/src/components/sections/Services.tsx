"use client";

import React, { useRef, useEffect, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { Timeline } from "@/components/ui/Timeline";
import AnimatedFlowSVG from "../ui/AnimatedFlow";

const timelineData = [
  {
    title: "Signup and create account",
    content: (
      <p className="text-white text-sm md:text-[20px] leading-[1.9] max-w-md">
        Signup and create a student profile to find the best tutors for you. No
        payments, free signup. Access all the topics you want to learn.
      </p>
    ),
  },
  {
    title: "Enter the topic you want to learn",
    content: (
      <p className="text-white text-sm md:text-[20px] leading-[1.9] max-w-md">
        Select the tutor you want to learn from. We have wide range of tutors
        which will match your learning style.
      </p>
    ),
  },
  {
    title: "Connect to your tutor instantly",
    content: (
      <p className="text-white text-sm md:text-[20px] leading-[1.9] max-w-md">
        Instantly connect to your tutor and learn. You getting it right is our
        responsibility. Solve instant assignments, give tests and a lot more.
      </p>
    ),
  },
];

const Content = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      if (timelineRef.current) {
        setTimelineHeight(timelineRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <section
      id="services"
      className="py-12 px-4 mt-32 flex flex-col items-center justify-center mx-4 bg-black rounded-2xl shadow-md gap-20 overflow-x-hidden "
    >
      <div className="flex flex-col items-center justify-center gap-2 w-full">
        <div className="border border-white/[0.2] flex flex-col items-center md:items-start mx-auto p-4 max-w-xs md:max-w-none relative">
          <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
          <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
          <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
          <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />
          <h2 className="text-3xl md:text-4xl font-khula font-semibold text-white text-center md:text-left">
            Learning made easy
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-20 w-full max-w-7xl">
        <div ref={timelineRef} className="hidden md:flex w-full md:w-1/2">
          <Timeline data={timelineData} />
        </div>

        <div
          className="hidden md:flex w-full md:w-1/2 justify-center items-start"
          style={{
            height: timelineHeight ? `${timelineHeight - 250}px` : "500px",
            marginTop: "0px",
          }}
        >
          <div
            style={{
              height: timelineHeight ? `${timelineHeight - 250}px` : "500px",
              width: "100%",
            }}
          >
            <AnimatedFlowSVG />
          </div>
        </div>

        <div className="flex md:hidden flex-col gap-10 w-full">
          <div className="w-full">
            <Timeline data={timelineData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
