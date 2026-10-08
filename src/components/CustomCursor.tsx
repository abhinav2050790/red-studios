"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop with fine pointers
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let velX = 0;
    let velY = 0;
    let lastX = mouseX;
    let lastY = mouseY;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX = e.clientX;
      mouseY = e.clientY;

      velX = mouseX - lastX;
      velY = mouseY - lastY;
      lastX = mouseX;
      lastY = mouseY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleOverInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(".interactive-target") ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-cursor='hover']") ||
        target.closest("input") ||
        target.closest("textarea")
      ) {
        setIsHovered(true);
        document.body.classList.add("cursor-hover");
      } else {
        setIsHovered(false);
        document.body.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleOverInteractive, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const animate = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      const speed = Math.hypot(velX, velY);
      const angle = Math.atan2(velY, velX);
      const stretch = Math.min(1 + speed * 0.012, 1.28);
      const squash = Math.max(1 - speed * 0.006, 0.80);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${squash})`;
      }

      velX *= 0.88;
      velY *= 0.88;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleOverInteractive);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.body.classList.remove("cursor-hover");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Center pinpoint matching index.html */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-[7px] w-[7px] rounded-full bg-[#ff3333] shadow-[0_0_10px_#ff3333] transition-opacity duration-150"
      />

      {/* Physics inertia ring matching index.html (52px normal, 76px on hover) */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border-[1.5px] border-[#ff3333] transition-[width,height,background-color] duration-200 ${
          isHovered
            ? "h-[76px] w-[76px] bg-[#ff3333]/[0.12] opacity-100"
            : "h-[52px] w-[52px] bg-transparent opacity-90"
        }`}
      />
    </>
  );
}
