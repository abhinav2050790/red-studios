"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/content/studio";

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) =>
      prevIdx === 0 ? TESTIMONIALS.length - 1 : prevIdx - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIdx) =>
      prevIdx === TESTIMONIALS.length - 1 ? 0 : prevIdx + 1
    );
  };

  // Mobile Touch Swipe Handling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        if (deltaX < 0) {
          next();
        } else {
          prev();
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const active = TESTIMONIALS[currentIndex];

  return (
    <section className="relative z-10 bg-[#FFFFFF] py-24 sm:py-48 lg:py-60 text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Client Endorsements
          </div>
          <h2 className="font-serif text-2xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
            Trusted By Visionary Founders.
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg lg:text-xl leading-relaxed text-black/60">
            Hear directly from the teams who entrusted Red Studios with their brand cinematography, commercials, and digital flagships.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative mx-auto mt-16 sm:mt-24 lg:mt-32 max-w-5xl touch-pan-y"
        >
          {/* Subtle soft blush backdrop */}
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-r from-[#FFD1DC]/40 via-[#FFE4E9]/30 to-[#FFE6D9]/40 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-[#FAF9F7] p-6 sm:p-16 lg:p-20 shadow-xl backdrop-blur-md">
            {/* Top Bar: 5-star rating + Quote Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-black text-black"
                  />
                ))}
                <span className="ml-3 font-mono text-xs text-black/50">
                  5.0 Verified Review
                </span>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-sm">
                <Quote className="h-5 w-5" />
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="mt-10 min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                >
                  <blockquote className="font-serif text-lg sm:text-2xl lg:text-4xl font-medium leading-relaxed text-black">
                    &ldquo;{active.quote}&rdquo;
                  </blockquote>

                  {/* Author Meta */}
                  <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-base font-bold text-black">
                          {active.clientName}
                        </span>
                        <span className="rounded-full bg-black/[0.06] border border-black/10 px-3 py-0.5 font-mono text-[10px] uppercase text-black font-semibold">
                          {active.projectType}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-black/50">
                        {active.clientRole}, {active.company}
                      </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={prev}
                        aria-label="Previous testimonial"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 bg-white text-black shadow-xs transition-colors hover:bg-black hover:text-white cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={next}
                        aria-label="Next testimonial"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 bg-white text-black shadow-xs transition-colors hover:bg-black hover:text-white cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Pagination */}
            <div className="mt-10 flex justify-center gap-2.5">
              {TESTIMONIALS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === dotIdx
                      ? "w-8 bg-black"
                      : "w-2 bg-black/20 hover:bg-black/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
