"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  ChevronDown,
  Sparkles,
  Compass,
} from "lucide-react";

type PhaseId = 1 | 2 | 3;

export default function InspoEditorialShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhase, setActivePhase] = useState<PhaseId>(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const durationRef = useRef(12.03);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Compute active phase based on progress
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

  // Video initialization & wake-up on mount (Crucial for iOS Safari & Android Chrome)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    // Wake up hardware video decoder
    const primePromise = video.play();
    if (primePromise !== undefined) {
      primePromise
        .then(() => {
          if (!isPlayingAuto) {
            video.pause();
            video.currentTime = targetTimeRef.current;
          }
        })
        .catch(() => {
          // Autoplay policy will unlock on first user scroll/interaction
        });
    }

    const unlockPlayback = () => {
      if (video.paused && !isPlayingAuto) {
        const p = video.play();
        if (p !== undefined) {
          p.then(() => {
            video.pause();
            video.currentTime = targetTimeRef.current;
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", unlockPlayback, { once: true, passive: true });
    window.addEventListener("touchstart", unlockPlayback, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", unlockPlayback);
      window.removeEventListener("touchstart", unlockPlayback);
    };
  }, [isPlayingAuto]);

  // Ultra-smooth lerped video scrubbing loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      if (!isPlayingAuto) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.008) {
          currentTimeRef.current += diff * 0.35;
          const nextTime = Math.max(0, Math.min(durationRef.current, currentTimeRef.current));
          if (!video.seeking) {
            if ("fastSeek" in video && typeof (video as unknown as { fastSeek: (t: number) => void }).fastSeek === "function") {
              (video as unknown as { fastSeek: (t: number) => void }).fastSeek(nextTime);
            } else {
              video.currentTime = nextTime;
            }
          }
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
      videoRef.current.currentTime = targetTimeRef.current;
    }
  };

  // Quick jump to specific phase with smooth scroll
  const jumpToPhase = useCallback((phase: PhaseId) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const startY = scrollTop + rect.top;
    const totalDist = rect.height - window.innerHeight;

    const targets: Record<PhaseId, number> = {
      1: 0.04,
      2: 0.50,
      3: 0.96,
    };

    const targetY = startY + totalDist * targets[phase];
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

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

  const phaseNames: Record<PhaseId, string> = {
    1: "Museum of Ancient Art",
    2: "Anatomical Specifications",
    3: "Mutilated Masterpiece",
  };

  return (
    <section
      ref={containerRef}
      id="editorial-showcase"
      className="relative w-full bg-[#000000] text-white select-none overflow-clip"
      style={{ height: "340vh" }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-[100vh] h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center">
        {/* ============================================================ */}
        {/* 1. VIBRANT ROYAL BLUE SPOTLIGHT BACKDROP (Pinterest Video)   */}
        {/* ============================================================ */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(ellipse 90% 85% at 50% 50%, #002ae6 0%, #00137d 38%, #00052a 70%, #000000 100%)",
          }}
        />

        {/* Ambient Top & Bottom Vignette to Blend Seamlessly with Page */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-[1]" />

        {/* ============================================================ */}
        {/* 2. TOP HUD HEADER                                            */}
        {/* ============================================================ */}
        <header className="relative z-20 w-full px-4 sm:px-10 lg:px-14 pt-safe pointer-events-auto">
          <div className="pt-3 sm:pt-4 pb-2 flex items-center justify-between">
            {/* Left: Project Badge & Active Phase Indicator */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6] animate-pulse" />
              <div className="flex flex-col">
                <span className="font-mono text-[9px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
                  LOUVRE &bull; SCULPTURE EXHIBITION
                </span>
                <span className="font-mono text-[8px] sm:text-[10px] tracking-wider text-white/50">
                  Phase 0{activePhase}: {phaseNames[activePhase]}
                </span>
              </div>
            </div>

            {/* Right: Interactive Mode Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Continuous Auto-Play / Scroll Scrub Toggle */}
              <button
                onClick={toggleAutoPlay}
                title={isPlayingAuto ? "Pause Film" : "Play Continuous 3D Film"}
                className="touch-press flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] sm:text-xs font-mono text-white transition-all cursor-pointer backdrop-blur-md"
              >
                {isPlayingAuto ? (
                  <>
                    <Pause className="w-3 h-3 text-[#3b82f6]" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#3b82f6] fill-[#3b82f6]" />
                    <span>{isPlayingAuto ? "Pause" : "Play"}</span>
                  </>
                )}
              </button>

              {/* Expand / Center Frame Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Fit Tablet Frame" : "Expand Full Viewport"}
                className="touch-press hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] sm:text-xs font-mono text-white transition-all cursor-pointer backdrop-blur-md"
              >
                {isExpanded ? (
                  <>
                    <Minimize2 className="w-3 h-3 text-white" />
                    <span>Frame</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3 h-3 text-white" />
                    <span>Expand</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 3. CENTER: 3D FLOATING TABLET CHASSIS WITH PURE VIDEO         */}
        {/* ============================================================ */}
        <div className="relative z-10 flex-1 w-full flex items-center justify-center p-2 sm:p-6 lg:p-8 min-h-0">
          <div
            className={`relative transition-all duration-700 overflow-hidden flex items-center justify-center ${
              isExpanded
                ? "w-full h-full max-w-6xl rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_30px_100px_rgba(0,18,70,0.95)]"
                : "w-full max-w-[94vw] sm:max-w-[760px] lg:max-w-[860px] aspect-square rounded-[22px] sm:rounded-[36px] border-[3px] sm:border-[6px] border-[#0c0d1e] shadow-[0_25px_90px_rgba(0,18,70,0.9),0_0_120px_rgba(0,50,220,0.35)] bg-black"
            }`}
          >
            {/* The HD 1080p Intra-Frame Scrubbed Video */}
            <video
              ref={videoRef}
              src="/pinterest_inspo_hd_fastseek.mp4"
              poster="/pinterest_inspo_poster.jpg"
              muted
              playsInline
              loop={isPlayingAuto}
              autoPlay
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-contain block select-none pointer-events-none"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. BOTTOM INTERACTIVE TIMELINE SCRUB HUD                     */}
        {/* ============================================================ */}
        <footer className="relative z-20 w-full px-4 sm:px-10 lg:px-14 pb-20 sm:pb-safe pointer-events-auto">
          <div className="pt-2 sm:pt-3 pb-2 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 border-t border-white/[0.12] backdrop-blur-xs">
            {/* Left: Phase Navigation Buttons */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-white/50">
                Phase:
              </span>
              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-full border border-white/15 backdrop-blur-md">
                {( [1, 2, 3] as PhaseId[] ).map((p) => (
                  <button
                    key={p}
                    onClick={() => jumpToPhase(p)}
                    className={`touch-press px-2.5 sm:px-3 py-1 rounded-full font-mono text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                      activePhase === p
                        ? "bg-[#3b82f6] text-white shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-105"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    0{p} {p === 1 ? "Origin" : p === 2 ? "Specs" : "History"}
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Live Scrubbing Progress Gauge */}
            <div className="w-full sm:max-w-xs flex items-center gap-3">
              <span className="font-mono text-[10px] text-white/40">0%</span>
              <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#3b82f6] transition-all duration-100 shadow-[0_0_8px_#3b82f6]"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#3b82f6] font-bold">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            {/* Right: Scroll Scrub Instruction */}
            <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-white/60 tracking-wider uppercase">
              <span>Scroll to scrub 3D statue &amp; halo</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#3b82f6] animate-bounce" />
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
