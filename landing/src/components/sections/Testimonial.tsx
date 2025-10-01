import React from "react";
import { InfiniteMovingCards } from "@/components/ui/InfiniteMovingCards";
import { Icon } from "@/components/ui/Icon";

const testimonials = [
  {
    quote: "Amazing library, super fast setup!",
    name: "Jane Doe",
    title: "CEO, Example Co.",
  },
  {
    quote: "Loved the animations and design.",
    name: "John Smith",
    title: "Founder, Another Co.",
  },
  {
    quote: "Amazing library, super fast setup!",
    name: "Jane Doe",
    title: "CEO, Example Co.",
  },
  {
    quote: "Loved the animations and design.",
    name: "John Smith",
    title: "Founder, Another Co.",
  },
  {
    quote: "Amazing library, super fast setup!",
    name: "Jane Doe",
    title: "CEO, Example Co.",
  },
  {
    quote: "Loved the animations and design.",
    name: "John Smith",
    title: "Founder, Another Co.",
  },
  {
    quote: "Amazing library, super fast setup!",
    name: "Jane Doe",
    title: "CEO, Example Co.",
  },
  {
    quote: "Loved the animations and design.",
    name: "John Smith",
    title: "Founder, Another Co.",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="py-12 px-4 md:mt-24 flex flex-col items-center justify-center mx-4 
                 bg-gray-100 rounded-2xl shadow-md md:gap-10 overflow-x-hidden
                 dark:bg-black"
    >
      <div className="flex flex-col items-center justify-center gap-2 mb-12">
        <div className="border border-gray-300 flex flex-col items-center md:items-start mx-auto p-3 md:p-6 max-w-xs md:max-w-none relative 
                        dark:border-white/[0.2]">
          <Icon className="absolute h-6 w-6 -top-3 -left-3 text-gray-600 dark:text-white" />
          <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-gray-600 dark:text-white" />
          <Icon className="absolute h-6 w-6 -top-3 -right-3 text-gray-600 dark:text-white" />
          <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-gray-600 dark:text-white" />
          <h2 className="text-4xl font-khula font-semibold text-gray-900 text-center md:text-left 
                         dark:text-white">
            Loved by people everywhere
          </h2>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center md:max-w-none">
        <InfiniteMovingCards
          items={testimonials}
          direction="left"
          speed="fast"
          pauseOnHover={false}
          className="max-w-[600px] md:max-w-[1300px] "
        />
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="fast"
          pauseOnHover={false}
          className="max-w-[600px] md:max-w-[1300px]"
        />
      </div>
    </section>
  );
}
