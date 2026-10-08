"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Send,
  CheckCircle,
  Plus,
} from "lucide-react";

export default function InspoEditorialShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeLang, setActiveLang] = useState<"EN" | "FR" | "ES">("EN");
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const totalSlides = 7;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmailInput("");
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <section id="editorial-showcase" className="relative w-full bg-[#FFFFFF] text-[#0A0A0A] overflow-hidden select-none">
      {/* Top Sticky Header Styled exactly as inspo.mp4 */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-black/[0.06] px-6 sm:px-12 py-5 flex items-center justify-between">
        {/* Left: Minimalist Key Glyph Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => goToSlide(0)}
            aria-label="Go to first slide"
            className="flex items-center gap-2 group cursor-pointer"
          >
            {/* Minimalist Key Glyphic SVG */}
            <svg
              className="w-8 h-8 text-black transition-transform group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="16" r="5" />
              <line x1="14" y1="16" x2="27" y2="16" />
              <line x1="23" y1="16" x2="23" y2="20" />
              <line x1="27" y1="16" x2="27" y2="21" />
            </svg>
            <span className="font-display text-sm font-bold tracking-widest uppercase text-black">
              RED STUDIOS
            </span>
          </button>
        </div>

        {/* Center: Editorial Nav Links with active dot */}
        <nav className="hidden md:flex items-center gap-10 text-xs font-sans tracking-wide text-black/70">
          <button
            onClick={() => goToSlide(0)}
            className="relative pb-1 font-medium text-black transition-colors"
          >
            Editorial
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black" />
          </button>
          <button
            onClick={() => goToSlide(1)}
            className="hover:text-black transition-colors"
          >
            Categories
          </button>
          <button
            onClick={() => goToSlide(2)}
            className="hover:text-black transition-colors"
          >
            Prêt-à-porter
          </button>
          <button
            onClick={() => goToSlide(3)}
            className="hover:text-black transition-colors"
          >
            Brands
          </button>
          <button
            onClick={() => goToSlide(5)}
            className="hover:text-black transition-colors"
          >
            Lookbook
          </button>
        </nav>

        {/* Right: Share icon + Faceted Special Issue Badge + Menu */}
        <div className="flex items-center gap-5 sm:gap-7">
          <button
            aria-label="Share"
            className="text-black/60 hover:text-black transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Faceted 8-point polygon Badge: SPECIAL ISSUE */}
          <div className="hidden sm:flex relative items-center justify-center">
            <div className="w-11 h-11 bg-black rounded-lg transform rotate-45 flex items-center justify-center shadow-sm">
              <span className="font-mono text-[8px] font-bold tracking-tighter text-white uppercase text-center -rotate-45 leading-[1]">
                SPECIAL<br />ISSUE
              </span>
            </div>
          </div>

          {/* 2-line Minimalist Drawer Trigger */}
          <button
            aria-label="Menu"
            className="flex flex-col gap-1.5 w-6 cursor-pointer group py-1"
          >
            <span className="h-[2px] w-6 bg-black transition-transform group-hover:translate-x-0.5" />
            <span className="h-[2px] w-4 bg-black transition-transform group-hover:w-6" />
          </button>
        </div>
      </header>

      {/* Main Slides Canvas Container */}
      <div className="relative w-full min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center px-4 sm:px-12 py-10">
        <AnimatePresence mode="wait">
          {/* ============================================================ */}
          {/* SLIDE 1 (*01): THE LITTLE VANITY / RED STUDIOS               */}
          {/* ============================================================ */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
            >
              {/* Left Column: Full Editorial Portrait */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-none shadow-2xl">
                  <Image
                    src="/editorial_model_01.jpg"
                    alt="Red Studios Editorial Model"
                    fill
                    className="object-cover grayscale contrast-125"
                    priority
                  />
                </div>
                {/* Subtle bottom indicator line */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-[1px] w-16 bg-black/20" />
                  <span className="font-mono text-[10px] text-black/40">PORTRAIT 01</span>
                </div>
              </div>

              {/* Right Column: Editorial Typography & Pink Blob */}
              <div className="lg:col-span-7 relative flex flex-col justify-between min-h-[480px]">
                <div className="relative pt-6">
                  {/* Small tracked top label */}
                  <p className="font-serif tracking-[0.45em] text-xs sm:text-sm text-black/70 uppercase mb-3">
                    T H E &nbsp; L I T T L E
                  </p>

                  {/* Huge Didone Vanity Title */}
                  <h1 className="font-serif text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tight text-black leading-none mb-6">
                    VANITY
                  </h1>

                  {/* Soft Pastel Pink / Peach Gradient Blob */}
                  <div className="relative mt-4 flex items-center gap-6">
                    <div className="relative flex items-center justify-center">
                      <div className="w-40 sm:w-52 h-40 sm:h-52 rounded-full bg-gradient-to-tr from-[#FFD1DC] via-[#FFE4E9] to-[#FFE6D9] blur-md opacity-90" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-sans text-xs sm:text-sm font-semibold tracking-widest uppercase text-black">
                          FIND YOURS
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Hairline with Point */}
                    <div className="hidden sm:flex items-center">
                      <div className="w-24 h-[1px] bg-black/40" />
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  </div>
                </div>

                {/* Editorial Subtitle */}
                <p className="max-w-md text-xs sm:text-sm text-black/60 leading-relaxed mt-6">
                  High-end commercial cinematography, DaVinci Resolve color grading, and modern high-performance web experiences.
                </p>

                {/* Bottom Slide Controls */}
                <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-black/10 pt-8">
                  {/* Arrow controls & Pill bar */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevSlide}
                      aria-label="Previous"
                      className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Next"
                      className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Pill Progress indicator */}
                    <div className="w-16 h-1 bg-black/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Bold Slide Number */}
                  <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-black">
                    *01
                  </div>

                  {/* Language Selector */}
                  <div className="flex items-center gap-3 font-mono text-xs text-black/40">
                    {(["EN", "FR", "ES"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`transition-colors cursor-pointer ${
                          activeLang === lang ? "text-black font-bold" : "hover:text-black"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 2 (*02): WEEK IN FASHION + EDIT / ORIAL STACKED        */}
          {/* ============================================================ */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Left Column: Heading + Copy + Photo */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black uppercase mb-4">
                    WEEK IN PRODUCTION
                  </h2>
                  <p className="text-xs sm:text-sm text-black/60 leading-relaxed max-w-sm mb-8">
                    Discover our weekly showcase of raw studio captures, macro lens tabletop lighting, and DaVinci color grading masterpieces.
                  </p>
                </div>

                {/* Monochrome Bottom Photo */}
                <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden shadow-xl">
                  <Image
                    src="/editorial_model_01.jpg"
                    alt="Week in Production"
                    fill
                    className="object-cover grayscale contrast-125"
                  />
                </div>
              </div>

              {/* Center: Soft Translucent Pink Rectangle Card */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="w-56 sm:w-64 h-72 sm:h-80 rounded-2xl bg-gradient-to-br from-[#FFE4E9]/80 via-[#FFF0F3]/70 to-[#FFE6D9]/80 p-6 flex flex-col justify-between border border-pink-200/50 shadow-sm backdrop-blur-sm">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-black/50">
                    FEATURED STORY
                  </span>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-black mb-1">
                      Visual Pacing & Rhythm
                    </h4>
                    <p className="text-[11px] text-black/60 leading-snug">
                      Engineered hooks and kinetic cuts designed to maximize watch time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Stacked EDIT / ORIAL + Vertical Photo */}
              <div className="lg:col-span-4 flex items-center justify-between gap-6">
                {/* Giant Stacked Typography: EDIT (horizontal) + ORIAL (vertical) */}
                <div className="flex flex-col items-center">
                  <span className="font-serif text-5xl sm:text-7xl font-bold text-black tracking-tight">
                    EDIT
                  </span>
                  <span className="font-serif text-5xl sm:text-7xl font-bold text-black tracking-widest [writing-mode:vertical-rl] mt-2">
                    ORIAL
                  </span>
                </div>

                {/* Vertical Photo: Model with Straw */}
                <div className="relative aspect-[3/4] w-48 sm:w-56 overflow-hidden shadow-xl">
                  <Image
                    src="/editorial_model_02.jpg"
                    alt="Editorial model with straw"
                    fill
                    className="object-cover grayscale contrast-125"
                  />
                </div>
              </div>

              {/* Slide 2 Bottom Controls */}
              <div className="lg:col-span-12 mt-8 flex items-center justify-between border-t border-black/10 pt-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-black">
                  *02
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-black/40">
                  <span>EN</span>
                  <span>FR</span>
                  <span>ES</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 3 (*03): UNLEASH SENSUALITY / CROUCHING MODEL          */}
          {/* ============================================================ */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl relative flex flex-col justify-between min-h-[580px]"
            >
              {/* Center Background Pink Orb */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-[#FFD1DC] via-[#FFE4E9] to-[#FFE6D9] blur-2xl opacity-80 z-0" />

              {/* Giant Serif Typography Overlapping Center */}
              <div className="relative z-10 w-full text-center">
                <h2 className="font-serif text-5xl sm:text-8xl lg:text-[10rem] font-bold tracking-tight text-black leading-none">
                  UNLEASH
                </h2>
              </div>

              {/* Middle Row: Left copy + Center Model + Right SENSUALITY */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
                {/* Left Column: Subtitle + Are You Ready Pill Button */}
                <div className="md:col-span-4 text-left">
                  <span className="font-sans text-xs tracking-widest uppercase text-black/50 block mb-2">
                    YOUR BRAND POTENTIAL
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-black mb-3">
                    Cinematics for visionaries
                  </h3>
                  <p className="text-xs text-black/60 leading-relaxed max-w-xs mb-6">
                    Every frame engineered with DaVinci Resolve color sciences and robotic camera kinematics.
                  </p>

                  {/* Exact "ARE YOU READY?" Pill Button with Arrow */}
                  <a
                    href="#brief"
                    className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-black text-black font-sans text-xs font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-all cursor-pointer"
                  >
                    <span>ARE YOU READY?</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Center: Crouching Model */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative aspect-[3/4] w-64 sm:w-72 overflow-hidden shadow-2xl">
                    <Image
                      src="/editorial_model_03.jpg"
                      alt="Unleash Creative Sensuality"
                      fill
                      className="object-cover grayscale contrast-125"
                    />
                  </div>
                </div>

                {/* Right Column: Giant Bottom Word SENSUALITY */}
                <div className="md:col-span-4 text-right">
                  <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-none">
                    SENSUALITY
                  </h2>
                </div>
              </div>

              {/* Slide 3 Bottom Controls */}
              <div className="relative z-10 mt-12 flex items-center justify-between border-t border-black/10 pt-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-black">
                  *03
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-black/40">
                  <span>EN</span>
                  <span>FR</span>
                  <span>ES</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 4 (*04): BE YOUR OWN MUSE + ROTATING SOCIAL BADGE     */}
          {/* ============================================================ */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
            >
              {/* Left Column: Vertical Photo Beside Vintage Car */}
              <div className="lg:col-span-5 relative">
                {/* Soft pink circular shape behind photo */}
                <div className="pointer-events-none absolute -left-10 -top-10 w-64 h-64 rounded-full bg-gradient-to-tr from-[#FFD1DC] to-[#FFE6D9] blur-xl opacity-70 z-0" />

                <div className="relative z-10 aspect-[3/4] w-full max-w-md mx-auto overflow-hidden shadow-2xl">
                  <Image
                    src="/editorial_model_04.jpg"
                    alt="Be Your Own Muse"
                    fill
                    className="object-cover grayscale contrast-125"
                  />
                </div>
              </div>

              {/* Right Column: Title + Rotating Circular Badge + Paragraph */}
              <div className="lg:col-span-7 relative flex flex-col justify-between min-h-[480px]">
                {/* Top Section with Rotating Circular Text Stamp */}
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
                      BE YOUR<br />OWN MUSE
                    </h2>
                  </div>

                  {/* Rotating Circular Text Stamp Badge */}
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <path
                          id="circlePath"
                          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                          fill="none"
                        />
                        <text className="text-[7.5px] font-mono uppercase tracking-[0.2em] fill-black font-semibold">
                          <textPath href="#circlePath">
                            ✦ FOLLOW US ON SOCIAL NETWORKS ✦
                          </textPath>
                        </text>
                      </svg>
                    </motion.div>
                    {/* Center Cross / Plus */}
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Body Text */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-black/70 leading-relaxed">
                  <p>
                    Red Studios unifies cinematic product direction with high-performance code. We partner with fearless founders seeking to establish unmistakable luxury presence.
                  </p>
                  <div>
                    <p className="mb-3">
                      Commercial film editing, sound design, and bespoke Next.js platforms built to convert.
                    </p>
                    <a
                      href="#work"
                      className="inline-flex items-center gap-2 font-mono text-[11px] font-bold text-black uppercase underline underline-offset-4 hover:text-[#E10600] transition-colors"
                    >
                      <span>Explore Archive</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Bottom Slide Controls */}
                <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-black">
                    *04
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs text-black/40">
                    <span>EN</span>
                    <span>FR</span>
                    <span>ES</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 5 (*05): FROSTED GLASS / DON'T HIDE YOURSELF           */}
          {/* ============================================================ */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-5"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
            >
              {/* Left Column: Frosted Glass Photo + Vertical DON'T HIDE YOURSELF */}
              <div className="lg:col-span-6 flex items-center gap-6 sm:gap-10">
                {/* Photo through frosted glass */}
                <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden shadow-2xl">
                  <Image
                    src="/editorial_model_05.jpg"
                    alt="Don't hide yourself"
                    fill
                    className="object-cover grayscale contrast-125"
                  />
                </div>

                {/* Vertical Stacked Serif Typography: DON'T HIDE YOURSELF */}
                <div className="flex flex-col items-center">
                  <span className="font-serif text-3xl sm:text-5xl font-bold text-black tracking-widest [writing-mode:vertical-rl]">
                    DON&apos;T HIDE
                  </span>
                  <span className="font-serif text-3xl sm:text-5xl font-bold text-black tracking-widest [writing-mode:vertical-rl] mt-4">
                    YOURSELF
                  </span>
                </div>
              </div>

              {/* Right Column: Pink Gradient Card + Get Self Confident */}
              <div className="lg:col-span-6 flex flex-col justify-between min-h-[440px]">
                {/* Soft Pink Translucent Card */}
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FFE4E9]/60 via-[#FFF0F3]/50 to-[#FFE6D9]/60 border border-pink-200/40 shadow-sm backdrop-blur-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-black/50 block mb-2">
                    BRAND IDENTITY
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black mb-4">
                    Command Attention Boldly
                  </h3>
                  <p className="text-xs sm:text-sm text-black/70 leading-relaxed mb-8 max-w-md">
                    In a market flooded with templated designs and lifeless content, boldness is the only viable differentiator. We construct arresting visual flagships that refuse to be ignored.
                  </p>

                  <a
                    href="#services"
                    className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-black text-black font-sans text-xs font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-all cursor-pointer"
                  >
                    <span>LEARN MORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Bottom Slide Controls */}
                <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-black">
                    *05
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs text-black/40">
                    <span>EN</span>
                    <span>FR</span>
                    <span>ES</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 6 (*06): THE LOOKBOOK SEASON 025—                     */}
          {/* ============================================================ */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-6"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl relative flex flex-col justify-between min-h-[520px]"
            >
              {/* Top Lookbook Title with Extended Rule */}
              <div className="w-full">
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black uppercase">
                    THE LOOKBOOK SEASON 025—
                  </h2>
                </div>
              </div>

              {/* Middle Row: Dual Photo Layout + Check This CTA */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-8">
                {/* Left Photo with Pink Circle Behind */}
                <div className="md:col-span-4 relative flex justify-center">
                  <div className="pointer-events-none absolute -left-4 -top-4 w-48 h-48 rounded-full bg-gradient-to-tr from-[#FFD1DC] to-[#FFE4E9] blur-md opacity-80" />
                  <div className="relative z-10 aspect-square w-56 sm:w-64 overflow-hidden shadow-xl">
                    <Image
                      src="/editorial_model_01.jpg"
                      alt="Lookbook 01"
                      fill
                      className="object-cover grayscale contrast-125"
                    />
                  </div>
                </div>

                {/* Center Horizontal Photo */}
                <div className="md:col-span-5 relative">
                  <div className="relative aspect-[16/9] w-full overflow-hidden shadow-2xl">
                    <Image
                      src="/editorial_model_06.jpg"
                      alt="Lookbook Horizontal"
                      fill
                      className="object-cover grayscale contrast-125"
                    />
                  </div>
                </div>

                {/* Right Column: Suggestions & CHECK THIS */}
                <div className="md:col-span-3 text-left">
                  <p className="text-xs text-black/60 leading-relaxed mb-6">
                    A curated selection of our commercial cinematography, high-speed fluid motion captures, and award-level landing pages.
                  </p>

                  <a
                    href="#work"
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold text-black uppercase tracking-wider underline underline-offset-4 hover:text-[#E10600] transition-colors cursor-pointer"
                  >
                    <span>CHECK THIS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Bottom Slide Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-black">
                  *06
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-black/40">
                  <span>EN</span>
                  <span>FR</span>
                  <span>ES</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 7 (*07): SUBSCRIBE NEWSLETTER & REWIND                */}
          {/* ============================================================ */}
          {currentSlide === 6 && (
            <motion.div
              key="slide-7"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl rounded-3xl bg-gradient-to-br from-[#FFE4E9] via-[#FFF0F3] to-[#FFE6D9] p-8 sm:p-16 lg:p-20 relative overflow-hidden border border-pink-200/50 shadow-lg min-h-[520px] flex flex-col justify-between"
            >
              {/* Top Bar with REWIND Button */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-black/50">
                  CONNECT WITH RED STUDIOS
                </span>

                {/* Rewind Button */}
                <button
                  onClick={() => goToSlide(0)}
                  className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REWIND</span>
                </button>
              </div>

              {/* Center Content: Newsletter & Discovery Intake */}
              <div className="my-auto max-w-xl">
                <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-black uppercase mb-4">
                  SUBSCRIBE NEWSLETTER
                </h2>
                <p className="text-xs sm:text-sm text-black/70 leading-relaxed mb-8">
                  Receive private invitations to our quarterly lookbook screenings, commercial project breakdowns, and creative direction case studies.
                </p>

                {/* Form Input with SEND Button */}
                {isSubscribed ? (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-white text-black font-mono text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>You are subscribed. Welcome to Red Studios editorial dispatch.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex items-center gap-3">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="insert your email..."
                      required
                      className="flex-1 px-5 py-3.5 rounded-xl bg-white border border-black/10 text-black text-xs font-sans placeholder-black/40 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-black text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-black/80 transition-colors cursor-pointer"
                    >
                      SEND
                    </button>
                  </form>
                )}

                <div className="mt-8 flex items-center gap-6">
                  <a
                    href="#brief"
                    className="font-mono text-xs font-semibold text-black uppercase underline underline-offset-4 hover:text-[#E10600] transition-colors"
                  >
                    Start Project Brief &rarr;
                  </a>
                  <a
                    href="#call"
                    className="font-mono text-xs font-semibold text-black uppercase underline underline-offset-4 hover:text-[#E10600] transition-colors"
                  >
                    Book Discovery Call &rarr;
                  </a>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="border-t border-black/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-black/40">
                <p>© 2025 Red Studios production. All rights reserved.</p>
                <div className="font-mono text-3xl font-bold text-black mt-2 sm:mt-0">
                  *07
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
