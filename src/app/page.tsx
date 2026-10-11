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

    // Smooth transition lock duration (700ms)
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 700);
  }, []);

  // One-scroll calibrated gesture controller
  useEffect(() => {
    // Lock window scroll to top
    window.scrollTo(0, 0);

    let touchStartY = 0;
    let touchStartX = 0;

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
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;

      // Ensure vertical swipe gesture
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
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

  const transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black text-white select-none">
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
    </div>
  );
}
