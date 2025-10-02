"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const CTA = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="cta"
      className="overflow-y-hidden relative py-20 px-4 mt-20 mb-24 flex flex-col items-center justify-center 
                 max-w-7xl mx-auto rounded-2xl gap-12"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 w-full bg-grid pointer-events-none rounded-2xl"
        aria-hidden="true"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 40%, black 60%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 40%, black 60%, transparent 100%)",
        }}
      />

      {/* Background */}
      <div
        className={`absolute inset-0 w-full h-full rounded-2xl opacity-90 transparent`}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute top-[300px] left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 
                   rounded-full pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(200,200,200,0.2) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
        <h1 className="md:text-6xl text-4xl pt-20 font-[var(--font-primary)] text-center relative z-10">
          Your All-in-one Learning
        </h1>

        <h1 className="md:text-6xl text-4xl pt-4 font-[var(--font-primary)] text-center">
          Companion
        </h1>

        <Link
          href="https://dev.dn03fv11bz1ey.amplifyapp.com/"
          className="mt-10
    rounded-full border px-18 py-1.5 transition-all duration-300
    bg-[var(--color-primary)] text-[var(--background)] dark:text-[var(--foreground)] border-[var(--color-primary)]
    hover:bg-[var(--background)] hover:text-[var(--color-font)] hover:border-[var(--foreground)]
  "
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default CTA;
