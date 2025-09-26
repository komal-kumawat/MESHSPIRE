import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="overflow-x-hidden py-4 px-4 mt-20 top-10 flex items-center bg-slate-800 max-w-7xl mx-auto justify-center flex-col gap-4 rounded-3xl"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="mt-10">
          <Link href="/">
            <img
              src="/logo_dark.svg"
              alt="Dashboard dark"
              width={250}
              height={100}
            />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center items-center font-catamaran gap-8 sm:gap-16 mt-12 text-sm sm:text-base">
          <Link
            href="#services"
            className="text-slate-400 font-medium tracking-tight hover:text-white transition-all duration-300"
          >
            Services
          </Link>
          <Link
            href="#features"
            className="text-slate-400 font-medium tracking-tight hover:text-white transition-all duration-300"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-slate-400 font-medium tracking-tight hover:text-white transition-all duration-300"
          >
            Testimonials
          </Link>
          <Link
            href="#contact"
            className="text-slate-400 font-medium tracking-tight hover:text-white transition-all duration-300"
          >
            Contact us
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-[40px] text-slate-400 mt-10 text-xl">
        <a
          href="https://github.com/StealthSilver"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="w-6 h-6 hover:text-white transition-colors duration-300" />
        </a>
        <a
          href="https://x.com/Rajat_0409"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="w-6 h-6 hover:text-white transition-colors duration-300" />
        </a>
        <a href="mailto:rajat.saraswat.0409@gmail.com">
          <Mail className="w-6 h-6 hover:text-white transition-colors duration-300" />
        </a>
        <a
          href="https://www.linkedin.com/in/rajat-saraswat-0491a3259/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="w-6 h-6 hover:text-white transition-colors duration-300" />
        </a>
      </div>

      <div className="w-[85%] sm:w-[65%] h-[0.5px] bg-slate-600 mt-8" />

      <p className="text-sm text-slate-400">
        &copy; {new Date().getFullYear()} MeshSpire. All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
