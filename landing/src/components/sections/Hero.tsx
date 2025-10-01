"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const Hero = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <section
      id="home"
      className={`
        relative max-w-7xl mx-auto pt-12 px-4 flex flex-col items-center justify-center
        overflow-hidden overflow-x-hidden
        bg-[var(--background)] text-[var(--color-font)]
      `}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[400px] md:w-[1000px] h-[430px] md:h-full mx-auto"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center pt-6">
        <button
          className="
    bg-[var(--background)] text-[var(--color-font)] border border-[var(--foreground)]
    hover:bg-[var(--hover-dark)] hover:text-[var(--hover-light)]
    font-small font-[var(--font-secondary)]
    px-6 md:px-10 py-1 text-sm md:text-base 
    transition-all duration-500 ease-in-out rounded-full mb-6 md:mb-0
  "
          style={{ borderWidth: "0.5px" }}
        >
          Launching Oct 2025
        </button>

        <div className="relative inline-block pt-4 md:pt-20 text-center">
          <h1 className="md:text-6xl text-4xl font-khula font-extrabold tracking-tighter relative z-10">
            Fastest and most efficient
          </h1>
        </div>

        <h1 className="md:text-6xl text-4xl font-khula font-extrabold tracking-tighter text-center">
          way to learn
        </h1>

        <p className="md:text-xl text-base font-catamaran pt-10 text-center px-6">
          A super fast peer to peer learning platform
        </p>
        <p className="md:text-xl text-base font-catamaran text-center px-6">
          Find the teacher which is most suited to your learning style
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center pt-12 gap-6 md:gap-[120px]">
          <Link
            href="https://dev.dn03fv11bz1ey.amplifyapp.com/"
            className={`${
              isDark
                ? "bg-green-600 hover:bg-green-900 text-white"
                : "bg-green-400 hover:bg-green-600 text-black"
            } font-catamaran font-bold px-10 py-2 md:px-20 rounded-full transition-colors duration-300 cursor-pointer inline-block text-sm md:text-base`}
          >
            Login
          </Link>
          <Link
            href="#footer"
            className={`${
              isDark
                ? "bg-black hover:bg-white text-white hover:text-black border-white"
                : "bg-white hover:bg-black text-black hover:text-white border-black"
            } font-catamaran font-bold px-10 py-2 md:px-14 transition-all duration-300 rounded-full w-[160px] md:w-[200px] text-sm md:text-base text-center flex items-center justify-center`}
          >
            Contact us
          </Link>
        </div>
      </div>

      <img
        src={isDark ? "/Dashboard-Dark.png" : "/Dashboard-Light.png"}
        alt="Dashboard"
        width={1280}
        height={750}
        className="w-[90%] h-full object-contain sticky top-0 right-0 border-[10px] mt-10 md:mt-[136px] border-gray-600 rounded-2xl z-10"
      />
    </section>
  );
};

export default Hero;
