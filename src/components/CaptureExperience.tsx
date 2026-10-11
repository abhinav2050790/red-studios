"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CaptureExperienceProps {
  currentSlide: number; // 0: Home, 1: About Us, 2: Products, 3: FAQs/Join
  onNavigate: (index: number) => void;
  onGoToIntro?: () => void;
}

export default function CaptureExperience({
  currentSlide,
  onNavigate,
  onGoToIntro,
}: CaptureExperienceProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail("");
    }
  };

  // Smooth buttery transition matching video
  const transition = { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div
      id="capture-experience"
      className="relative w-full h-full overflow-hidden bg-[#FFFFFF] text-black font-sans selection:bg-black selection:text-white"
    >
      {/* =======================================================================
          TOP NAVIGATION BAR (PERSISTENT & REACTIVE)
          ======================================================================= */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between pt-6 sm:pt-8 px-6 sm:px-12 pointer-events-auto">
        <button
          onClick={() => {
            if (onGoToIntro) {
              onGoToIntro();
            } else {
              onNavigate(0);
            }
          }}
          className="font-syne font-extrabold text-xl sm:text-2xl tracking-tight transition-colors cursor-pointer select-none"
          style={{ color: currentSlide === 1 || currentSlide === 3 ? "#FFFFFF" : "#000000" }}
        >
          CAPTURE
        </button>

        {/* Center Pill Menu with Active Indicator */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#111111] text-white rounded-full text-xs shadow-md border border-white/10">
          <button
            onClick={() => onNavigate(0)}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              currentSlide === 0
                ? "border border-white/60 text-white font-medium bg-white/10"
                : "text-[#a5a5a5] hover:text-white"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate(1)}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              currentSlide === 1
                ? "border border-white/60 text-white font-medium bg-white/10"
                : "text-[#a5a5a5] hover:text-white"
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => onNavigate(2)}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              currentSlide === 2
                ? "border border-white/60 text-white font-medium bg-white/10"
                : "text-[#a5a5a5] hover:text-white"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => onNavigate(3)}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              currentSlide === 3
                ? "border border-white/60 text-white font-medium bg-white/10"
                : "text-[#a5a5a5] hover:text-white"
            }`}
          >
            FAQs
          </button>
        </nav>

        {/* Right Login Button */}
        <button
          className="px-5 sm:px-6 py-1.5 sm:py-2 rounded text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
          style={{
            border: currentSlide === 1 || currentSlide === 3 ? "1px solid #FFFFFF" : "1px solid #000000",
            color: currentSlide === 1 || currentSlide === 3 ? "#FFFFFF" : "#000000",
            backgroundColor: "transparent",
          }}
        >
          LOGIN
        </button>
      </header>

      {/* =======================================================================
          STAGE 1: HERO STATE ("CAPTURE MOMENTS")
          ======================================================================= */}
      <motion.div
        animate={{
          opacity: currentSlide === 0 ? 1 : 0,
          y: currentSlide === 0 ? 0 : -50,
          pointerEvents: currentSlide === 0 ? "auto" : "none",
        }}
        transition={transition}
        className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12 pointer-events-none"
      >
        {/* Viewfinder Crop Marks & Dotted Lines */}
        <div className="absolute inset-5 sm:inset-8 md:inset-10 pointer-events-none z-10 flex flex-col justify-between">
          <div className="relative w-full flex items-center justify-between">
            <div className="w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-[#999999]" />
            <div className="flex-1 h-[1px] border-t border-dashed border-[#d5d5d5] mx-2" />
            <div className="w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-[#999999]" />
          </div>
          <div className="relative w-full flex items-center justify-between">
            <div className="w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-[#999999]" />
            <div className="flex-1 h-[1px] border-b border-dashed border-[#d5d5d5] mx-2" />
            <div className="w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-[#999999]" />
          </div>
        </div>

        {/* Top Spacer */}
        <div className="w-full h-12" />

        {/* Center Giant Headline behind camera */}
        <div className="relative flex-1 flex flex-col items-center justify-center my-auto py-8">
          <div className="w-full flex flex-col items-center justify-center select-none leading-none pointer-events-none">
            <h1 className="font-syne font-extrabold text-[15vw] sm:text-[14vw] tracking-[-0.04em] text-black text-center w-full">
              CAPTURE
            </h1>
            <h2 className="font-syne font-extrabold text-[15vw] sm:text-[14vw] tracking-[-0.04em] text-black text-center w-full mt-[-2vw]">
              MOMENTS
            </h2>
          </div>
        </div>

        {/* Bottom Left Specs, Center Script Scroll, Right Copy */}
        <div className="relative z-20 w-full flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pb-2 px-2 sm:px-4 pointer-events-auto">
          <div className="flex flex-col items-start gap-4 max-w-[310px]">
            <motion.button
              onClick={() => onNavigate(1)}
              className="px-6 py-2.5 sm:px-7 sm:py-3 bg-black text-white text-[12px] sm:text-xs font-medium rounded-full -rotate-12 hover:-rotate-6 hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer select-none"
              whileTap={{ scale: 0.95 }}
            >
              Explore Specs
            </motion.button>
            <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#1a1a1a] font-normal">
              Capture&apos;s fast, proprietary sensor ensures unrivaled speed and clarity, making it a time machine for your memories.
            </p>
          </div>

          <button
            onClick={() => onNavigate(1)}
            className="group flex flex-col items-center gap-0.5 font-script text-2xl sm:text-3xl text-black hover:opacity-75 transition-opacity cursor-pointer select-none py-1"
          >
            <span className="flex items-center gap-1.5">
              Scroll Down <span className="inline-block transition-transform duration-300 group-hover:translate-y-1 font-serif text-lg">↓</span>
            </span>
          </button>

          <div className="max-w-[310px] text-right sm:text-left">
            <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#1a1a1a] font-normal">
              Precision engineered for pros and enthusiasts, discover a shooting experience where intuitive design meets revolutionary power, crystalizing your vision.
            </p>
          </div>
        </div>
      </motion.div>

      {/* =======================================================================
          STAGE 2: "ULTRA HD" & DIAGONAL DARK BACKDROP
          ======================================================================= */}
      <motion.div
        animate={{
          y: currentSlide === 1 ? "0%" : currentSlide > 1 ? "-100%" : "100%",
        }}
        transition={transition}
        className="absolute inset-0 z-20 bg-[#070707] text-white flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden [clip-path:polygon(0_3vw,100%_0,100%_100%,0_100%)] shadow-2xl"
      >
        {/* Subtle Architectural Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Watermark "ULTRA HD" */}
        <motion.div
          animate={{ opacity: currentSlide === 1 ? 1 : 0 }}
          transition={transition}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        >
          <span className="font-syne font-extrabold text-[18vw] sm:text-[16vw] text-[#141414] tracking-tight leading-none">
            ULTRA HD
          </span>
        </motion.div>

        <div className="w-full h-12" />

        {/* Content Row */}
        <motion.div
          animate={{
            opacity: currentSlide === 1 ? 1 : 0,
            y: currentSlide === 1 ? 0 : 30,
          }}
          transition={transition}
          className="relative z-10 w-full flex-1 flex flex-col md:flex-row items-center justify-between gap-10 my-auto py-8 pointer-events-auto"
        >
          <div className="w-full md:w-1/3 flex flex-col items-start gap-4">
            <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] tracking-tight">
              Defining the Future of
              <br />
              Visual Fidelity.
            </h2>
            <p className="text-xs sm:text-sm text-[#b0b0b0] leading-relaxed max-w-[340px]">
              The Capture Engine delivers true 16–bit color and dynamic range, authentically capturing light from deepest shadows to brightest peaks.
            </p>
            <motion.button
              onClick={() => onNavigate(2)}
              className="mt-4 px-7 py-3 bg-white text-black text-xs font-semibold rounded-full -rotate-15 hover:-rotate-6 hover:scale-105 transition-transform duration-300 shadow-[0_12px_24px_rgba(255,255,255,0.18)] cursor-pointer select-none"
              whileTap={{ scale: 0.95 }}
            >
              See the Difference
            </motion.button>
          </div>

          <div className="w-full md:w-1/3 pointer-events-none h-48 md:h-0" />

          <div className="w-full md:w-1/4 flex flex-col items-start md:items-end text-left md:text-right gap-2">
            <h3 className="font-syne font-bold text-lg sm:text-xl text-white">
              Pioneering Sensor Design.
            </h3>
            <p className="text-xs sm:text-sm text-[#b0b0b0] leading-relaxed max-w-[280px]">
              Aerospace aluminum body ensures 8K thermal stability and enduring performance.
            </p>
          </div>
        </motion.div>

        {/* Bottom White Scroll Down */}
        <div className="relative z-20 w-full flex justify-center pb-2 pointer-events-auto">
          <button
            onClick={() => onNavigate(2)}
            className="group flex flex-col items-center gap-0.5 font-script text-2xl sm:text-3xl text-white hover:opacity-75 transition-opacity cursor-pointer select-none py-1"
          >
            <span className="flex items-center gap-1.5">
              Scroll Down <span className="inline-block transition-transform duration-300 group-hover:translate-y-1 font-serif text-lg">↓</span>
            </span>
          </button>
        </div>
      </motion.div>

      {/* =======================================================================
          STAGE 3: "Storytelling, Unrestricted." & 4 POLAROIDS BURST
          ======================================================================= */}
      <motion.div
        animate={{
          opacity: currentSlide === 2 ? 1 : 0,
          pointerEvents: currentSlide === 2 ? "auto" : "none",
        }}
        transition={transition}
        className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-10 md:p-12"
      >
        <div className="w-full h-12" />

        <div className="relative z-10 w-full flex-1 flex flex-col md:flex-row items-center justify-between gap-8 my-auto py-8">
          <motion.div
            animate={{
              y: currentSlide === 2 ? 0 : 30,
              opacity: currentSlide === 2 ? 1 : 0,
            }}
            transition={transition}
            className="w-full md:w-1/3 flex flex-col items-start pointer-events-auto"
          >
            <h2 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl text-black leading-[1.05] tracking-tight">
              Storytelling,
              <br />
              Unrestricted.
            </h2>
          </motion.div>

          <div className="w-full md:w-1/3 pointer-events-none h-48 md:h-0" />

          <motion.div
            animate={{
              y: currentSlide === 2 ? 0 : 30,
              opacity: currentSlide === 2 ? 1 : 0,
            }}
            transition={transition}
            className="w-full md:w-1/4 flex flex-col items-start md:items-end text-left md:text-right gap-4 pointer-events-auto"
          >
            <p className="text-xs sm:text-sm text-[#111111] leading-relaxed max-w-[320px]">
              Intuitive controls and revolutionary EVF ensure effortless handling. Focus purely on the scene for exceptional results. Download the guide.
            </p>
            <motion.button
              onClick={() => onNavigate(3)}
              className="px-7 py-3 bg-black text-white text-xs font-semibold rounded-full -rotate-12 hover:-rotate-6 hover:scale-105 transition-transform duration-300 shadow-[0_12px_24px_rgba(0,0,0,0.22)] cursor-pointer select-none"
              whileTap={{ scale: 0.95 }}
            >
              Download Guide
            </motion.button>
          </motion.div>
        </div>

        <div className="relative z-20 w-full flex justify-center pb-2 pointer-events-auto">
          <button
            onClick={() => onNavigate(3)}
            className="group flex flex-col items-center gap-0.5 font-script text-2xl sm:text-3xl text-black hover:opacity-75 transition-opacity cursor-pointer select-none py-1"
          >
            <span className="flex items-center gap-1.5">
              Scroll Down <span className="inline-block transition-transform duration-300 group-hover:translate-y-1 font-serif text-lg">↓</span>
            </span>
          </button>
        </div>
      </motion.div>

      {/* 4 Polaroids Burst (Centered behind/around the camera) */}
      <div className="absolute inset-0 z-35 flex items-center justify-center pointer-events-none">
        {/* 1. Palms (Top-Left) */}
        <motion.div
          animate={{
            x: currentSlide === 2 ? (isMobile ? -95 : -210) : 0,
            y: currentSlide === 2 ? (isMobile ? -85 : -140) : 0,
            scale: currentSlide === 2 ? 1 : 0.2,
            opacity: currentSlide === 2 ? 1 : 0,
            rotate: currentSlide === 2 ? -10 : 0,
          }}
          transition={transition}
          className="absolute p-1.5 sm:p-2.5 pb-5 sm:pb-8 bg-white shadow-[0_20px_35px_rgba(0,0,0,0.18)] rounded-[2px] pointer-events-auto cursor-pointer will-change-transform"
          whileHover={{ scale: 1.1, rotate: -5, zIndex: 60 }}
        >
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 overflow-hidden bg-slate-100">
            <Image src="/polaroid_palms_hd.jpg" alt="Tropical Palms" fill className="object-cover" sizes="160px" />
          </div>
        </motion.div>

        {/* 2. Venice (Bottom-Left) */}
        <motion.div
          animate={{
            x: currentSlide === 2 ? (isMobile ? -95 : -210) : 0,
            y: currentSlide === 2 ? (isMobile ? 95 : 150) : 0,
            scale: currentSlide === 2 ? 1 : 0.2,
            opacity: currentSlide === 2 ? 1 : 0,
            rotate: currentSlide === 2 ? 9 : 0,
          }}
          transition={transition}
          className="absolute p-1.5 sm:p-2.5 pb-5 sm:pb-8 bg-white shadow-[0_20px_35px_rgba(0,0,0,0.18)] rounded-[2px] pointer-events-auto cursor-pointer will-change-transform"
          whileHover={{ scale: 1.1, rotate: 4, zIndex: 60 }}
        >
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 overflow-hidden bg-slate-100">
            <Image src="/polaroid_venice_hd.jpg" alt="Venice Canal" fill className="object-cover" sizes="160px" />
          </div>
        </motion.div>

        {/* 3. Forest (Top-Right) */}
        <motion.div
          animate={{
            x: currentSlide === 2 ? (isMobile ? 95 : 210) : 0,
            y: currentSlide === 2 ? (isMobile ? -85 : -130) : 0,
            scale: currentSlide === 2 ? 1 : 0.2,
            opacity: currentSlide === 2 ? 1 : 0,
            rotate: currentSlide === 2 ? 7 : 0,
          }}
          transition={transition}
          className="absolute p-1.5 sm:p-2.5 pb-5 sm:pb-8 bg-white shadow-[0_20px_35px_rgba(0,0,0,0.18)] rounded-[2px] pointer-events-auto cursor-pointer will-change-transform"
          whileHover={{ scale: 1.1, rotate: 2, zIndex: 60 }}
        >
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 overflow-hidden bg-slate-100">
            <Image src="/polaroid_forest_hd.jpg" alt="Forest Canopy" fill className="object-cover" sizes="160px" />
          </div>
        </motion.div>

        {/* 4. Stars (Bottom-Right) */}
        <motion.div
          animate={{
            x: currentSlide === 2 ? (isMobile ? 100 : 230) : 0,
            y: currentSlide === 2 ? (isMobile ? 100 : 160) : 0,
            scale: currentSlide === 2 ? 1 : 0.2,
            opacity: currentSlide === 2 ? 1 : 0,
            rotate: currentSlide === 2 ? 15 : 0,
          }}
          transition={transition}
          className="absolute p-2 sm:p-3 pb-6 sm:pb-9 bg-white shadow-[0_20px_35px_rgba(0,0,0,0.18)] rounded-[2px] pointer-events-auto cursor-pointer will-change-transform"
          whileHover={{ scale: 1.1, rotate: 8, zIndex: 60 }}
        >
          <div className="relative w-26 h-26 sm:w-40 sm:h-40 md:w-44 md:h-44 overflow-hidden bg-slate-100">
            <Image src="/polaroid_stars_hd.jpg" alt="Starry Sky" fill className="object-cover" sizes="180px" />
          </div>
        </motion.div>
      </div>

      {/* =======================================================================
          MASTER LIVING CAMERA (CALIBRATED ANGLE & MOTION PER SLIDE)
          ======================================================================= */}
      <motion.div
        animate={{
          x: "-50%",
          y: currentSlide === 3 ? "-140%" : "-50%",
          rotate: currentSlide === 0 ? 0 : currentSlide === 1 ? 14 : currentSlide === 2 ? -16 : 0,
          opacity: currentSlide === 3 ? 0 : 1,
          scale: currentSlide === 0 ? 1 : currentSlide === 1 ? 0.98 : currentSlide === 2 ? 1.02 : 0.9,
        }}
        initial={{ x: "-50%", y: "-50%", rotate: 0 }}
        transition={transition}
        className="absolute top-1/2 left-1/2 z-40 w-[64vw] sm:w-[48vw] md:w-[40vw] max-w-[560px] min-w-[280px] pointer-events-auto cursor-pointer select-none will-change-transform"
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative w-full aspect-[880/626] filter drop-shadow-[0_32px_44px_rgba(0,0,0,0.3)]">
          <Image
            src="/instax_camera.png"
            alt="Fujifilm Instax mini Evo"
            fill
            priority
            className="object-contain select-none pointer-events-none"
            sizes="(max-width: 768px) 75vw, 42vw"
          />
          <div className="absolute top-[8%] right-[11%] w-[13%] h-[15%] rounded-[6px] bg-white/75 blur-[5px] pointer-events-none animate-pulse" />
        </div>
      </motion.div>

      {/* =======================================================================
          STAGE 4: "Join the list" & GLOWING CRESCENT MOON FOOTER
          ======================================================================= */}
      <motion.div
        animate={{
          y: currentSlide === 3 ? "0%" : "100%",
        }}
        transition={transition}
        className="absolute inset-0 z-50 bg-[#070707] text-white flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl"
      >
        <div className="w-full h-12" />

        <div className="relative z-10 w-full flex-1 flex flex-col md:flex-row items-center justify-between gap-8 my-auto pointer-events-auto">
          {/* Glowing Crescent Moon */}
          <motion.div
            animate={{
              x: currentSlide === 3 ? 0 : -80,
              opacity: currentSlide === 3 ? 1 : 0,
            }}
            transition={transition}
            className="relative w-48 sm:w-64 md:w-80 aspect-[594/860] flex items-center justify-center shrink-0"
          >
            <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <Image
              src="/moon.png"
              alt="Glowing Crescent Moon"
              fill
              className="object-contain filter drop-shadow-[0_0_45px_rgba(255,255,255,0.2)]"
              sizes="320px"
            />
          </motion.div>

          {/* Newsletter Intake & Manifesto */}
          <motion.div
            animate={{
              y: currentSlide === 3 ? 0 : 40,
              opacity: currentSlide === 3 ? 1 : 0,
            }}
            transition={transition}
            className="flex-1 max-w-xl flex flex-col items-start gap-8 z-20 px-2 sm:px-6"
          >
            <div className="w-full flex flex-col items-start gap-3">
              <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                Join the list
              </h2>
              <p className="text-xs sm:text-sm text-[#888888] font-normal">
                Be the first to know about drops, edits, and exclusive previews.
              </p>

              <form onSubmit={handleSubscribe} className="w-full max-w-md mt-4 relative">
                <div className="relative flex items-center border-b border-[#333333] focus-within:border-white transition-colors pb-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter mail"
                    className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#555555] focus:outline-none pr-10 font-normal"
                  />
                  <button
                    type="submit"
                    aria-label="Submit email"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 text-[#888888] hover:text-white transition-all cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
                {submitted && (
                  <p className="text-xs text-green-400 mt-2 font-medium">
                    Thank you for joining the Capture list.
                  </p>
                )}
              </form>
            </div>

            <div className="w-full mt-4">
              <p className="text-xs sm:text-[13px] leading-relaxed text-[#777777] font-normal max-w-lg">
                At <strong className="text-white font-semibold">CAPTURE</strong> we empower every photographer—professional and beginner alike—to freeze time using unparalleled clarity and color fidelity, transforming fleeting moments into enduring, authentic masterpieces.
              </p>
            </div>
          </motion.div>

          {/* Navigation & Social Link Columns */}
          <div className="w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start gap-10 sm:gap-14 text-xs sm:text-sm z-20">
            <nav className="flex flex-col gap-2.5 text-[#b0b0b0]">
              <button onClick={() => onNavigate(0)} className="text-left hover:text-white transition-colors cursor-pointer">
                Home
              </button>
              <button onClick={() => onNavigate(1)} className="text-left hover:text-white transition-colors cursor-pointer">
                About Us
              </button>
              <button onClick={() => onNavigate(2)} className="text-left hover:text-white transition-colors cursor-pointer">
                Products
              </button>
              <button onClick={() => onNavigate(3)} className="text-left hover:text-white transition-colors cursor-pointer">
                FAQs
              </button>
            </nav>

            <div className="flex flex-col gap-2.5 text-[#777777]">
              <a href="#twitter" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#linkedin" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#instagram" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#x" className="hover:text-white transition-colors">
                X (Twitter)
              </a>
              <a href="#youtube" className="hover:text-white transition-colors">
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Giant Watermark & "Scroll Up ↑" */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end select-none pt-8 pointer-events-auto">
          <button
            onClick={() => onNavigate(0)}
            className="group flex flex-col items-center gap-0.5 font-script text-2xl sm:text-3xl text-white hover:opacity-75 transition-opacity cursor-pointer select-none mb-4 z-20"
          >
            <span className="flex items-center gap-1.5">
              Scroll Up <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1 font-serif text-lg">↑</span>
            </span>
          </button>

          <div className="w-full overflow-hidden flex justify-center pointer-events-none leading-none select-none">
            <span className="font-syne font-extrabold text-[18vw] text-[#131313] tracking-tight text-center w-full leading-none translate-y-3">
              CAPTURE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
