import React from "react";
import Link from "next/link";

const CTA = () => {
  return (
    <section
      id="cta"
      className="overflow-x-hidden overflow-hidden relative py-20 px-4 mt-20 mb-24 flex flex-col items-center justify-center max-w-7xl mx-auto rounded-2xl shadow-md gap-12"
    >
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

      <div
        className="absolute inset-0 w-full h-full bg-black rounded-2xl opacity-90"
        aria-hidden="true"
      />

      <div
        className="absolute top-[300px] left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(200,200,200,0.2) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
        <h1 className="md:text-6xl text-3xl pt-20 font-khula font-extrabold text-white tracking-tighter text-center md:text-left">
          Your All-in-one Learning
        </h1>

        <h1 className="md:text-6xl text-3xl pt-4 font-khula font-extrabold text-white tracking-tighter items-center">
          Companion
        </h1>
        <Link
          href="/MeshSpire/signup"
          className="bg-green-600 hover:bg-green-900 text-white font-catamaran font-bold px-20 py-2 mt-20 rounded-full transition-colors duration-300 cursor-pointer inline-block"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default CTA;
