"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ArrowRight,
  ChevronDown,
  Layers,
  Compass,
} from "lucide-react";

type PhaseId = 1 | 2 | 3;

export default function InspoEditorialShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhase, setActivePhase] = useState<PhaseId>(1);
  const [displayMode, setDisplayMode] = useState<"full" | "tablet">("full");
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const durationRef = useRef(12.03);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Active video source based on display mode
  const videoSrc =
    displayMode === "full"
      ? "/pinterest_inspo_fastseek.mp4"
      : "/pinterest_inspo_tablet_fastseek.mp4";

  // Phase computation
  const computePhase = (prog: number): PhaseId => {
    if (prog < 0.35) return 1;
    if (prog < 0.7) return 2;
    return 3;
  };

  // Scroll handler to scrub video timeline
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isPlayingAuto) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerH = rect.height - window.innerHeight;
      if (containerH <= 0) return;

      const topOffset = -rect.top;
      const progress = Math.max(0, Math.min(1, topOffset / containerH));

      setScrollProgress(progress);
      setActivePhase(computePhase(progress));

      targetTimeRef.current = progress * durationRef.current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPlayingAuto]);

  // Smooth lerped video scrubbing loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      if (!isPlayingAuto && video.readyState >= 2) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.01) {
          // Responsive lerp for instant seeking without frame drops
          currentTimeRef.current += diff * 0.28;
          video.currentTime = Math.max(0, Math.min(durationRef.current, currentTimeRef.current));
        }
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isPlayingAuto]);

  // Video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      durationRef.current = videoRef.current.duration || 12.03;
      setIsVideoLoaded(true);
      videoRef.current.currentTime = 0;
    }
  };

  // Quick jump to specific phase
  const jumpToPhase = (phase: PhaseId) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const startY = scrollTop + rect.top;
    const totalDist = rect.height - window.innerHeight;

    const targets: Record<PhaseId, number> = {
      1: 0.05,
      2: 0.5,
      3: 0.95,
    };

    const targetY = startY + totalDist * targets[phase];
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Toggle Auto Play loop mode
  const toggleAutoPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingAuto) {
      video.pause();
      setIsPlayingAuto(false);
    } else {
      video.play().catch(() => {});
      setIsPlayingAuto(true);
    }
  };

  // Video timeupdate during auto play
  const handleTimeUpdate = () => {
    if (isPlayingAuto && videoRef.current) {
      const cur = videoRef.current.currentTime;
      const prog = cur / durationRef.current;
      setScrollProgress(prog);
      setActivePhase(computePhase(prog));
    }
  };

  return (
    <section
      ref={containerRef}
      id="editorial-showcase"
      className="relative w-full bg-[#000000] text-white select-none"
      style={{ height: "340vh" }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-[100vh] h-[100dvh] w-full overflow-hidden flex flex-col justify-between">
        {/* Ambient Deep Royal Blue Glow Backdrop (Matching Pinterest Video) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
          style={{
            background:
              displayMode === "tablet"
                ? "radial-gradient(ellipse 90% 85% at 50% 50%, #0022cc 0%, #001155 45%, #000414 80%, #000000 100%)"
                : "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0, 51, 204, 0.25) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />

        {/* ============================================================ */}
        {/* 1. ARCHITECTURAL VERTICAL COLUMN GRID LINES                  */}
        {/* ============================================================ */}
        <div className="pointer-events-none absolute inset-0 z-[2] grid grid-cols-6 max-w-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-white/[0.04] sm:border-white/[0.06] first:border-l"
            />
          ))}
        </div>

        {/* ============================================================ */}
        {/* 2. VIDEO DISPLAY ENGINE (Full-Bleed or Tablet Chassis)       */}
        {/* ============================================================ */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center p-0 sm:p-6 lg:p-10 pointer-events-none">
          <div
            className={`relative transition-all duration-700 overflow-hidden ${
              displayMode === "tablet"
                ? "w-full max-w-[860px] aspect-square rounded-[36px] border-[6px] border-[#0a0a14] shadow-[0_25px_80px_rgba(0,18,70,0.8)] bg-black"
                : "w-full h-full"
            }`}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              playsInline
              loop={isPlayingAuto}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              className={`w-full h-full ${
                displayMode === "tablet" ? "object-contain" : "object-cover object-center"
              }`}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. TOP NAVIGATION BAR (Exact Replica from Video)             */}
        {/* ============================================================ */}
        <header className="relative z-20 w-full px-5 sm:px-12 pt-safe pointer-events-auto">
          <div className="pt-4 pb-3 flex items-center justify-between border-b border-white/[0.08]">
            {/* Left: Classical LOURVE Branding */}
            <div className="flex items-center gap-4">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.25em] uppercase text-white">
                LOURVE
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase text-white/40 border-l border-white/20 pl-4">
                Sculpture &bull; Antiquities
              </span>
            </div>

            {/* Center: Editorial Nav Links (Matching Video Exactly) */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-xs font-mono uppercase tracking-[0.2em] text-white/70">
              <button
                onClick={() => jumpToPhase(1)}
                className={`relative pb-1 transition-colors cursor-pointer ${
                  activePhase === 1 ? "text-white font-bold" : "hover:text-white"
                }`}
              >
                HOME
                {activePhase === 1 && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
                )}
              </button>
              <button
                onClick={() => jumpToPhase(2)}
                className={`relative pb-1 transition-colors cursor-pointer ${
                  activePhase === 2 ? "text-white font-bold" : "hover:text-white"
                }`}
              >
                COLLECTION
                {activePhase === 2 && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
                )}
              </button>
              <button
                onClick={() => jumpToPhase(3)}
                className={`relative pb-1 transition-colors cursor-pointer ${
                  activePhase === 3 ? "text-white font-bold" : "hover:text-white"
                }`}
              >
                ARTISTS
                {activePhase === 3 && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
                )}
              </button>
              <span className="text-white/40 cursor-default">EVENTS</span>
              <span className="text-white/40 cursor-default">VISIT</span>
            </nav>

            {/* Right: Mode Toggles & 3x3 Menu Grid Icon */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Auto Play / Scrub Toggle */}
              <button
                onClick={toggleAutoPlay}
                title={isPlayingAuto ? "Pause Film" : "Play Continuous Film"}
                className="touch-press flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] sm:text-xs font-mono text-white transition-colors cursor-pointer"
              >
                {isPlayingAuto ? (
                  <>
                    <Pause className="w-3 h-3 text-[#3b82f6]" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#3b82f6] fill-[#3b82f6]" />
                    <span>Play</span>
                  </>
                )}
              </button>

              {/* Tablet Frame vs Full-Bleed Mode Switcher */}
              <button
                onClick={() => setDisplayMode(displayMode === "full" ? "tablet" : "full")}
                title={displayMode === "full" ? "Switch to Tablet Frame" : "Switch to Full-Bleed"}
                className="touch-press hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] sm:text-xs font-mono text-white transition-colors cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>{displayMode === "full" ? "Tablet Mode" : "Full Bleed"}</span>
              </button>

              {/* 3x3 Dot Grid Menu Glyphic Button */}
              <button
                onClick={() => jumpToPhase(3)}
                aria-label="Collection Menu"
                className="touch-press w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
              >
                <div className="grid grid-cols-3 gap-1 w-3.5 h-3.5">
                  {[...Array(9)].map((_, idx) => (
                    <span key={idx} className="w-0.5 h-0.5 rounded-full bg-white" />
                  ))}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 4. MAIN INTERACTIVE CONTENT OVERLAYS                         */}
        {/* ============================================================ */}
        <div className="relative z-10 flex-1 w-full px-5 sm:px-12 flex items-center justify-between pointer-events-none">
          {/* Left Vertical Progress Rail (Exact Replica from Video) */}
          <div className="hidden sm:flex flex-col items-center gap-5 pointer-events-auto pr-6">
            <div className="relative flex flex-col items-center gap-4 py-2">
              {/* Rail Line */}
              <div className="absolute top-2 bottom-2 w-[1px] bg-white/15" />

              {/* Node 1: Origin */}
              <button
                onClick={() => jumpToPhase(1)}
                className="touch-press relative z-10 flex items-center gap-3 group cursor-pointer"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activePhase === 1
                      ? "bg-[#3b82f6] shadow-[0_0_10px_#3b82f6] scale-125"
                      : "bg-white/30 group-hover:bg-white"
                  }`}
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    activePhase === 1 ? "text-[#3b82f6] font-bold" : "text-white/40"
                  }`}
                >
                  01
                </span>
              </button>

              {/* Node 2: Anatomy */}
              <button
                onClick={() => jumpToPhase(2)}
                className="touch-press relative z-10 flex items-center gap-3 group cursor-pointer"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activePhase === 2
                      ? "bg-[#3b82f6] shadow-[0_0_10px_#3b82f6] scale-125"
                      : "bg-white/30 group-hover:bg-white"
                  }`}
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    activePhase === 2 ? "text-[#3b82f6] font-bold" : "text-white/40"
                  }`}
                >
                  02
                </span>
              </button>

              {/* Node 3: Masterpiece */}
              <button
                onClick={() => jumpToPhase(3)}
                className="touch-press relative z-10 flex items-center gap-3 group cursor-pointer"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activePhase === 3
                      ? "bg-[#3b82f6] shadow-[0_0_10px_#3b82f6] scale-125"
                      : "bg-white/30 group-hover:bg-white"
                  }`}
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    activePhase === 3 ? "text-[#3b82f6] font-bold" : "text-white/40"
                  }`}
                >
                  03
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic Content Region: Switches seamlessly as you scrub */}
          <div className="flex-1 max-w-4xl w-full h-full flex flex-col justify-center">
            {/* PHASE 1: Museum of Ancient Art */}
            {activePhase === 1 && (
              <motion.div
                key="phase-1-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-auto max-w-lg mt-auto sm:my-auto"
              >
                <h1 className="font-serif text-3xl min-[400px]:text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-4">
                  Museum <br />
                  of Ancient <br />
                  Art
                </h1>
                <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed max-w-md backdrop-blur-xs">
                  Home to timeless Hellenistic antiquities, monumental sculptures, and preserved classical heritage from the Mediterranean basin.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#3b82f6]">
                    ● Scroll down to rotate & explore
                  </span>
                </div>
              </motion.div>
            )}

            {/* PHASE 2: Architectural Breakdown / 3 Staggered Specs */}
            {activePhase === 2 && (
              <motion.div
                key="phase-2-content"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-auto max-w-md space-y-6 sm:space-y-8 my-auto"
              >
                {/* Spec 1: Alexandros of Antioch */}
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-white">
                    Alexandros of Antioch
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
                    Celebrated Hellenistic sculptor attributed with the creation of the monument, carving directly from Aegean Parian marble.
                  </p>
                </div>

                {/* Spec 2: 203 cm (80 in) */}
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-white">
                    203 cm (80 in)
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
                    Monumental classical scale, capturing ideal anatomical proportions of Aphrodite, Greek goddess of love and beauty.
                  </p>
                </div>

                {/* Spec 3: Island of Melos */}
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-white">
                    Island of Melos
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
                    Unearthed in 1820 on the Aegean island of Milos, preserved through centuries of Hellenistic and Roman history.
                  </p>
                </div>
              </motion.div>
            )}

            {/* PHASE 3: Discovery of a Mutilated Masterpiece */}
            {activePhase === 3 && (
              <motion.div
                key="phase-3-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-auto max-w-2xl my-auto"
              >
                <h2 className="font-serif text-3xl min-[400px]:text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
                  Discovery <br />
                  of a mutilated <br />
                  masterpiece
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm text-white/75 leading-relaxed">
                  <p>
                    Discovered within a buried niche near the ancient ruins of Milos by local farmer Yorgos Kentrotas, the sculpture was swiftly acquired for the French Marquis de Rivière before presentation to King Louis XVIII.
                  </p>
                  <p>
                    Missing both arms and her original left foot, the mysterious missing limbs provoked international debate among European historians, forever cementing her iconic status at the Musée du Louvre.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <a
                    href="#work"
                    className="touch-press inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-[#2563eb] transition-colors"
                  >
                    <span>View Exhibition Stills</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. BOTTOM CONTROL BAR (Scroll Scrub Meter & Mobile Jumper)   */}
        {/* ============================================================ */}
        <footer className="relative z-20 w-full px-5 sm:px-12 pb-safe pointer-events-auto">
          <div className="pt-3 pb-4 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08]">
            {/* Left: Mobile Phase Jumper (Thumb friendly) */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Phase:
              </span>
              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-full border border-white/15">
                {( [1, 2, 3] as PhaseId[] ).map((p) => (
                  <button
                    key={p}
                    onClick={() => jumpToPhase(p)}
                    className={`touch-press px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all cursor-pointer ${
                      activePhase === p
                        ? "bg-[#3b82f6] text-white shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    0{p}
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Live Scrubbing Progress Bar */}
            <div className="w-full sm:max-w-xs flex items-center gap-3">
              <span className="font-mono text-[10px] text-white/40">0%</span>
              <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3b82f6] transition-all duration-150"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-white/40">100%</span>
            </div>

            {/* Right: Scroll Indicator */}
            <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-white/50 tracking-wider uppercase">
              <span>Scroll to scrub 3D timeline</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#3b82f6] animate-bounce" />
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
