"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import FluidHero from "@/components/FluidHero";
import CaptureExperience from "@/components/CaptureExperience";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentSlideRef = useRef(0);
  const isAnimatingRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Master slide navigation
  const goToSlide = useCallback((nextIndex: number) => {
    const clamped = Math.max(0, Math.min(4, nextIndex));
    if (clamped === currentSlideRef.current) return;

    isAnimatingRef.current = true;
    setCurrentSlide(clamped);
    currentSlideRef.current = clamped;

    // Snappy transition lock duration (520ms for buttery 120fps mobile screens)
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 520);
  }, []);

  // Calibrated gesture controller for desktop wheels & mobile touch flick/swipes
  useEffect(() => {
    // Lock window scroll to top
    window.scrollTo(0, 0);

    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;

    const handleWheel = (e: WheelEvent) => {
      // Prevent native page scroll
      e.preventDefault();

      // If currently animating between slides, lock out until animation completes
      if (isAnimatingRef.current) {
        return;
      }

      // Filter out micro-movements
      if (Math.abs(e.deltaY) < 12) return;

      // Exactly one slide per gesture
      if (e.deltaY > 0) {
        if (currentSlideRef.current < 4) {
          goToSlide(currentSlideRef.current + 1);
        }
      } else if (e.deltaY < 0) {
        if (currentSlideRef.current > 0) {
          goToSlide(currentSlideRef.current - 1);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = performance.now();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent browser address bar pull-down and rubber-band bounce
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      if (!e.changedTouches.length) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;
      const deltaTime = Math.max(1, performance.now() - touchStartTime);
      const velocityY = Math.abs(deltaY) / deltaTime; // pixels per millisecond

      // Directional lock: ensure vertical swipe intent
      const isVertical = Math.abs(deltaY) > Math.abs(deltaX) * 1.15;
      if (!isVertical) return;

      // Feather-light flick (tuned for 120fps ProMotion screens) or deliberate swipe
      const isFlick = velocityY > 0.28 && Math.abs(deltaY) > 16;
      const isDeliberateSwipe = Math.abs(deltaY) > 34 && deltaTime < 900;

      // On Slide 0 (Fluid Hero), user might have been swirling fluid for multiple seconds
      // Avoid accidental transitions during liquid interaction
      if (currentSlideRef.current === 0) {
        const isIntroSwipe = deltaY > 30 && deltaTime < 550;
        const isIntroFlick = velocityY > 0.30 && deltaY > 18;
        if (isIntroFlick || isIntroSwipe) {
          goToSlide(1);
        }
        return;
      }

      // On Slides 1..4 (Capture Experience)
      if (isFlick || isDeliberateSwipe) {
        if (deltaY > 0 && currentSlideRef.current < 4) {
          goToSlide(currentSlideRef.current + 1);
        } else if (deltaY < 0 && currentSlideRef.current > 0) {
          goToSlide(currentSlideRef.current - 1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;

      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (currentSlideRef.current < 4) {
          e.preventDefault();
          goToSlide(currentSlideRef.current + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (currentSlideRef.current > 0) {
          e.preventDefault();
          goToSlide(currentSlideRef.current - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToSlide]);

  const transition = { duration: 0.52, ease: [0.22, 1, 0.32, 1] as const };

  const slidesMeta = [
    { index: 0, label: "Red Studios Intro" },
    { index: 1, label: "Capture Moments" },
    { index: 2, label: "Ultra HD Specs" },
    { index: 3, label: "Storytelling Polaroids" },
    { index: 4, label: "Join Capture List" },
  ];

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-black text-white select-none">
      {/* Slide 0: Red Studios Interactive Navier-Stokes Fluid Reveal Hero */}
      <motion.div
        className="absolute inset-0 w-full h-full z-20 will-change-transform"
        animate={{
          y: currentSlide === 0 ? "0%" : "-100%",
          opacity: currentSlide === 0 ? 1 : 0,
        }}
        transition={transition}
        style={{ pointerEvents: currentSlide === 0 ? "auto" : "none" }}
      >
        <FluidHero
          isActive={currentSlide === 0}
          onExplore={() => goToSlide(1)}
        />
      </motion.div>

      {/* Slides 1..4: Exact CAPTURE Camera Showcase from Video */}
      <motion.div
        className="absolute inset-0 w-full h-full z-10 will-change-transform"
        animate={{
          y: currentSlide === 0 ? "100%" : "0%",
          opacity: currentSlide === 0 ? 0 : 1,
        }}
        transition={transition}
        style={{ pointerEvents: currentSlide > 0 ? "auto" : "none" }}
      >
        <CaptureExperience
          currentSlide={Math.max(0, currentSlide - 1)}
          onNavigate={(targetCaptureSlide) => goToSlide(targetCaptureSlide + 1)}
          onGoToIntro={() => goToSlide(0)}
        />
      </motion.div>

      {/* Floating Thumb Dock (Ergonomic 1-tap mobile & desktop slide switcher) */}
      <nav
        aria-label="Slide navigation"
        className="fixed right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-[0_8px_28px_rgba(0,0,0,0.45)] pointer-events-auto select-none"
      >
        {slidesMeta.map((slide) => {
          const isActive = currentSlide === slide.index;
          return (
            <button
              key={slide.index}
              onClick={() => goToSlide(slide.index)}
              aria-label={slide.label}
              aria-current={isActive ? "step" : undefined}
              className="touch-press relative flex items-center justify-center w-6 h-6 rounded-full group cursor-pointer focus:outline-none"
            >
              <span
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? slide.index === 0
                      ? "w-1.5 h-4.5 bg-[#ff3333] shadow-[0_0_10px_#ff3333]"
                      : "w-1.5 h-4.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                    : "w-1.5 h-1.5 bg-white/40 group-hover:bg-white/80 group-hover:scale-125"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
