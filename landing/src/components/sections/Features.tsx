"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "../ui/Icon";
import { useTheme } from "next-themes";

const Content = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardData = [
    {
      icon: "/icons/ease.svg",
      title: "Ease of use",
      description:
        "It's as easy as using an Apple, but not as expensive as buying one.",
    },
    {
      icon: "/icons/cloud.svg",
      title: "100% uptime",
      description: "We can’t be taken down by anyone",
    },
    {
      icon: "/icons/fast.svg",
      title: "The fastest",
      description: "We will connect you to your tutors in limited time",
    },
    {
      icon: "/icons/heart.svg",
      title: "Student first",
      description: "Students are the priority, always and every time",
    },
    {
      icon: "/icons/refund.svg",
      title: "Money back",
      description: "If we can’t serve you. You need not pay",
    },
    {
      icon: "/icons/money.svg",
      title: "Best pricing",
      description: "Lowest learning prices. We don’t overcharge",
    },
    {
      icon: "/icons/tutor.svg",
      title: "Quality tutors",
      description: "We will match you to the best quality tutors",
    },
    {
      icon: "/icons/cluster.svg",
      title: "Learning cluster",
      description: "You just need one app for all your learning",
    },
  ];

  return (
    <section
      id="features"
      className={`overflow-x-hidden mt-10 py-12 px-4 flex flex-col items-center justify-center mx-4 rounded-2xl md:gap-12 md:mb-16
    ${isDark ? "bg-black" : "bg-transparent"}
  `}
    >

      {/* Title */}
      <div
        className={`border flex flex-col items-start mx-auto p-3 md:p-6 relative mb-25 ${isDark ? "border-white/[0.2]" : "border-black/20"
          }`}
      >
        <Icon
          className={`absolute h-6 w-6 -top-3 -left-3 ${isDark ? "text-white" : "text-black"
            }`}
        />
        <Icon
          className={`absolute h-6 w-6 -bottom-3 -left-3 ${isDark ? "text-white" : "text-black"
            }`}
        />
        <Icon
          className={`absolute h-6 w-6 -top-3 -right-3 ${isDark ? "text-white" : "text-black"
            }`}
        />
        <Icon
          className={`absolute h-6 w-6 -bottom-3 -right-3 ${isDark ? "text-white" : "text-black"
            }`}
        />
        <h2
          className={`text-4xl font-khula font-extrabold ${isDark ? "text-white" : "text-black"
            }`}
        >
          Why MeshSpire?
        </h2>
      </div>

      {/* Cards */}
      <div className="flex flex-col max-w-7xl">
        <div className="flex flex-wrap justify-center items-start">
          {cardData.slice(0, 4).map((card, index) => (
            <div
              key={index}
              className={`group w-[25%] min-w-[250px] h-[180px] p-6 relative flex flex-col items-start overflow-hidden 
                border-l border-r border-b 
                ${isDark ? "border-white/[0.2]" : "border-black/10"}`}
            >
              {/* Hover overlay */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-0
                  ${isDark
                    ? "bg-gradient-to-br from-gray-800 to-black"
                    : "bg-gradient-to-br from-gray-100 to-gray-200"
                  }`}
              />
              {/* Left Accent Line */}
              <div
                className={`absolute left-0 top-[22px] w-[6px] h-[30px] rounded-tr-sm rounded-br-sm z-10 ${isDark ? "bg-white" : "bg-black"
                  }`}
              />

              <Image
                src={card.icon}
                alt={card.title}
                width={32}
                height={32}
                className="mb-3 z-10"
              />
              <h2
                className={`text-xl font-khula font-semibold mb-1 z-10 ${isDark ? "text-white" : "text-black"
                  }`}
              >
                {card.title}
              </h2>
              <p
                className={`text-sm opacity-80 font-catamaran z-10 ${isDark ? "text-white" : "text-gray-700"
                  }`}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap justify-center items-start">
          {cardData.slice(4, 8).map((card, index) => (
            <div
              key={index}
              className={`group w-[25%] min-w-[250px] h-[180px] p-6 relative flex flex-col items-start overflow-hidden 
                border-l border-r border-t 
                ${isDark ? "border-white/[0.2]" : "border-black/10"}`}
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-0
                  ${isDark
                    ? "bg-gradient-to-br from-gray-800 to-black"
                    : "bg-gradient-to-br from-gray-100 to-gray-200"
                  }`}
              />
              <div
                className={`absolute left-0 top-[22px] w-[6px] h-[30px] rounded-tr-sm rounded-br-sm z-10 ${isDark ? "bg-white" : "bg-black"
                  }`}
              />

              <Image
                src={card.icon}
                alt={card.title}
                width={32}
                height={32}
                className="mb-3 z-10"
              />
              <h2
                className={`text-xl font-khula font-semibold mb-1 z-10 ${isDark ? "text-white" : "text-black"
                  }`}
              >
                {card.title}
              </h2>
              <p
                className={`text-sm opacity-80 font-catamaran z-10 ${isDark ? "text-white" : "text-gray-700"
                  }`}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Content;
