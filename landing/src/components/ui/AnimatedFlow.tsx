"use client";

import React, { useEffect, useState } from "react";

const AnimatedFlowSVG = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const DuplicatedRect = (props: React.SVGProps<SVGRectElement>) => (
    <>
      <rect {...props} stroke="white" />
      <rect
        {...props}
        stroke="url(#scrollGradient)"
        style={{ opacity: scrollProgress }}
      />
    </>
  );

  const DuplicatedPath = (props: React.SVGProps<SVGPathElement>) => (
    <>
      <path {...props} stroke="white" />
      <path
        {...props}
        stroke="url(#scrollGradient)"
        style={{ opacity: scrollProgress }}
      />
    </>
  );

  return (
    <svg
      width="374"
      height="1338"
      viewBox="0 0 374 1338"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3BAB48" />
          <stop offset="100%" stopColor="#622ACB" />
        </linearGradient>
      </defs>

      <DuplicatedRect
        x={0.5}
        y={0.5}
        width={82}
        height={87}
        rx={19.5}
        strokeWidth={1}
      />
      <DuplicatedPath
        d="M35.1064 15.5C45.9581 15.5 54.7127 23.8682 54.7129 34.1396C54.7129 44.4113 45.9582 52.7802 35.1064 52.7803C24.2546 52.7803 15.5 44.4113 15.5 34.1396C15.5002 23.8681 24.2548 15.5 35.1064 15.5Z"
        strokeWidth={1}
      />
      <DuplicatedPath
        d="M48.8937 35.2201C59.7453 35.2201 68.4999 43.5883 68.5001 53.8597C68.5001 64.1314 59.7454 72.5003 48.8937 72.5004C38.0419 72.5004 29.2872 64.1314 29.2872 53.8597C29.2874 43.5882 38.042 35.2201 48.8937 35.2201Z"
        strokeWidth={1}
      />
      <DuplicatedPath
        d="M42.7271 89.3574L44.017 185.849C44.1647 196.894 53.2379 205.727 64.2826 205.58L171.773 204.143"
        strokeWidth={1}
      />
      <DuplicatedPath
        d="M123 843V1107C123 1118.05 131.954 1127 143 1127H169"
        strokeWidth={1}
      />
      <DuplicatedPath
        d="M217 699H259C270.046 699 279 690.046 279 679L279 372"
        strokeWidth={1}
      />

      <DuplicatedRect
        x={205.5}
        y={174.5}
        width={134}
        height={26}
        rx={9.5}
        strokeWidth={1}
      />

      <>
        <rect
          x={205.5}
          y={274.5}
          width={134}
          height={26}
          rx={9.5}
          fill="#1E1E1E"
          stroke="white"
          strokeWidth={1}
        />
        <rect
          x={205.5}
          y={274.5}
          width={134}
          height={26}
          rx={9.5}
          fill="#1E1E1E"
          stroke="url(#scrollGradient)"
          strokeWidth={1}
          style={{ opacity: scrollProgress }}
        />
      </>
      <DuplicatedRect
        x={171.5}
        y={87.5}
        width={201}
        height={286}
        rx={19.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={205.5}
        y={129.5}
        width={134}
        height={26}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={15.5}
        y={555.5}
        width={201}
        height={286}
        rx={19.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={33.5}
        y={611.5}
        width={105}
        height={27}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={157.5}
        y={611.5}
        width={40}
        height={27}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={157.5}
        y={663.5}
        width={40}
        height={27}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={157.5}
        y={715.5}
        width={40}
        height={27}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={157.5}
        y={767.5}
        width={40}
        height={27}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={33.5}
        y={663.5}
        width={105}
        height={27}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={33.5}
        y={715.5}
        width={105}
        height={27}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={33.5}
        y={767.5}
        width={105}
        height={27}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={172.5}
        y={1051.5}
        width={201}
        height={286}
        rx={19.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={191.5}
        y={1073.5}
        width={163}
        height={105}
        rx={9.5}
        strokeWidth={1}
      />
      <DuplicatedRect
        x={191.5}
        y={1198.5}
        width={107}
        height={14}
        rx={3.5}
        strokeWidth={1}
      />

      <>
        <rect
          x={248.5}
          y={1225.5}
          width={107}
          height={14}
          rx={3.5}
          fill="#1E1E1E"
          stroke="white"
          strokeWidth={1}
        />
        <rect
          x={248.5}
          y={1225.5}
          width={107}
          height={14}
          rx={3.5}
          fill="#1E1E1E"
          stroke="url(#scrollGradient)"
          strokeWidth={1}
          style={{ opacity: scrollProgress }}
        />
      </>
      <>
        <rect
          x={248.5}
          y={1252.5}
          width={107}
          height={14}
          rx={3.5}
          fill="#1E1E1E"
          stroke="white"
          strokeWidth={1}
        />
        <rect
          x={248.5}
          y={1252.5}
          width={107}
          height={14}
          rx={3.5}
          fill="#1E1E1E"
          stroke="url(#scrollGradient)"
          strokeWidth={1}
          style={{ opacity: scrollProgress }}
        />
      </>
      <DuplicatedRect
        x={194.5}
        y={1279.5}
        width={107}
        height={14}
        rx={3.5}
        strokeWidth={1}
      />
    </svg>
  );
};

export default AnimatedFlowSVG;
