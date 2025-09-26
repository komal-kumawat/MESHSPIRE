import React from "react";
import Image from "next/image";
import { Icon } from "../ui/Icon";

const Content = () => {
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
      className="overflow-x-hidden  py-12 px-4 flex flex-col items-center justify-center mx-4 bg-black rounded-2xl shadow-md md:gap-12 md:mb-16 "
    >
      <div className="border border-white/[0.2] flex flex-col items-start mx-auto p-3 md:p-6 relative mb-32">
        <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
        <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
        <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
        <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />
        <h2 className="text-4xl font-khula font-semibold text-white">
          Why MeshSpire?
        </h2>
      </div>

      <div className="flex flex-col max-w-7xl">
        <div className="flex flex-wrap justify-center items-start ">
          {cardData.slice(0, 4).map((card, index) => (
            <div
              key={index}
              className="group w-[25%] min-w-[250px] h-[180px] border-l border-r border-b border-white/[0.2] p-6 relative flex flex-col items-start overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-0" />
              <div className="absolute left-0 top-[22px] w-[6px] h-[30px] bg-white rounded-tr-sm rounded-br-sm z-10" />

              <Image
                src={card.icon}
                alt={card.title}
                width={32}
                height={32}
                className="mb-3 z-10"
              />
              <h2 className="text-xl font-khula font-semibold text-white mb-1 z-10">
                {card.title}
              </h2>
              <p className="text-white text-sm opacity-80 font-catamaran z-10">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-start">
          {cardData.slice(4, 8).map((card, index) => (
            <div
              key={index}
              className="group w-[25%] min-w-[250px] h-[180px] border-l border-r border-t border-white/[0.2] p-6 relative flex flex-col items-start overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-0" />

              <div className="absolute left-0 top-[22px] w-[6px] h-[30px] bg-white rounded-tr-sm rounded-br-sm z-10" />

              <Image
                src={card.icon}
                alt={card.title}
                width={32}
                height={32}
                className="mb-3 z-10"
              />
              <h2 className="text-xl font-khula font-semibold text-white mb-1 z-10">
                {card.title}
              </h2>
              <p className="text-white text-sm opacity-80 font-catamaran z-10">
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
