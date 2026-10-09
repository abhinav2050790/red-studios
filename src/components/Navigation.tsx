"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  PhoneCall,
  Sparkles,
  Compass,
  ArrowUp,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { NAV_LINKS, STUDIO_CONFIG } from "@/content/studio";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP HEADER (Sticky Glass Bar on md+ screens)          */}
      {/* ============================================================ */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "translate-y-0 opacity-100 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5"
            : "-translate-y-full opacity-0 pointer-events-none py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white font-bold tracking-tight text-lg group"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#E10600] group-hover:scale-125 transition-transform duration-200 shadow-[0_0_8px_#E10600]" />
            <span className="font-display tracking-tight text-white uppercase text-sm sm:text-base">
              RED <span className="text-[#8E8E93] group-hover:text-white transition-colors">STUDIOS</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-8 text-sm text-[#8E8E93] font-medium">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors duration-200 tracking-wide text-[13px] uppercase font-mono-code"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-4">
            <a
              href="#call"
              className="text-xs uppercase tracking-wider font-mono-code px-4 py-2 rounded-full border border-white/10 hover:border-white/25 text-white hover:bg-white/5 transition-all inline-flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#E10600]" />
              Book a Call
            </a>

            <a
              href="#brief"
              className="btn-primary text-xs uppercase tracking-wider font-mono-code !py-2 !px-4"
            >
              Start Project
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MOBILE TOP STATUS HEADER (Lightweight & Safe-Area Aware)   */}
      {/* ============================================================ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 pt-safe pointer-events-none">
        <div className="pt-2 pb-2 flex items-center justify-between pointer-events-auto">
          {/* Studio Brand Pill */}
          <Link
            href="/"
            className="touch-press inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-lg"
          >
            <span className="h-2 w-2 rounded-full bg-[#E10600] shadow-[0_0_8px_#E10600] animate-pulse" />
            <span className="font-display text-xs font-bold tracking-wider uppercase text-white">
              RED STUDIOS
            </span>
          </Link>

          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            <span>Q4 Available</span>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. MOBILE THUMB-ZONE FLOATING ACTION DOCK (iOS & Android)    */}
      {/* ============================================================ */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 sm:inset-x-6 z-40 max-w-md mx-auto pointer-events-auto"
        style={{
          paddingBottom: "max(0.25rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="relative flex items-center justify-between gap-1 rounded-full bg-[#0A0A0A]/95 p-1.5 backdrop-blur-2xl border border-white/15 text-white shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
          {/* Explore / Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Studio Menu"
            className="touch-press flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-semibold text-white/90 hover:text-white active:bg-white/10"
          >
            <Compass className="h-4 w-4 text-[#E10600]" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Explore</span>
          </button>

          <div className="h-5 w-[1px] bg-white/15" />

          {/* Book Call Button */}
          <a
            href="#call"
            className="touch-press flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-semibold text-white/90 hover:text-white active:bg-white/10"
          >
            <PhoneCall className="h-3.5 w-3.5 text-white/70" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Call</span>
          </a>

          <div className="h-5 w-[1px] bg-white/15" />

          {/* Project Brief Highlight Button */}
          <a
            href="#brief"
            className="touch-press flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#E10600] px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(225,6,0,0.5)] active:bg-[#ff1e19]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Brief</span>
          </a>

          {/* Back to top micro button */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="touch-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/60 hover:text-white active:bg-white/10"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* 4. MOBILE BOTTOM-SHEET MODAL DRAWER (iOS & Android Native)   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Bottom-Sheet Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10 w-full max-h-[88dvh] overflow-y-auto rounded-t-3xl border-t border-white/15 bg-[#0e0e0e] text-white p-6 pb-safe shadow-2xl flex flex-col justify-between"
              style={{
                paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
              }}
            >
              {/* Drag Handle & Top Bar */}
              <div>
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#E10600]" />
                    <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
                      Red Studios Navigation
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="touch-press h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 active:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Primary Navigation Links */}
                <nav className="mt-6 flex flex-col space-y-1">
                  {NAV_LINKS.map((link, idx) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="touch-press flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-[#E10600]">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#E10600] transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Bottom Quick Contacts & Launch Actions */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="#call"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="touch-press flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 font-mono text-xs uppercase tracking-wider text-white active:bg-white/15"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-[#E10600]" />
                    Discovery Call
                  </a>
                  <a
                    href="#brief"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="touch-press flex items-center justify-center gap-2 rounded-xl bg-[#E10600] py-3 font-mono text-xs uppercase tracking-wider font-bold text-white shadow-md active:bg-[#ff1e19]"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit Brief
                  </a>
                </div>

                {/* Studio Meta Information */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] font-mono text-white/50">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-white/40" />
                    <a href={`mailto:${STUDIO_CONFIG.email}`} className="hover:text-white">
                      {STUDIO_CONFIG.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-white/40" />
                    <span>{STUDIO_CONFIG.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
