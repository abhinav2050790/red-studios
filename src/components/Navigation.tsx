"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, PhoneCall } from "lucide-react";
import { NAV_LINKS, STUDIO_CONFIG } from "@/content/studio";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#8E8E93] font-medium">
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
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#book-call"
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

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
            className="md:hidden p-2 text-white/80 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col justify-between p-8 pt-24 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono-code uppercase tracking-widest text-[#8E8E93]">
            Navigation
          </span>
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-display font-semibold text-white hover:text-[#E10600] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-8 border-t border-white/10">
          <a
            href="#book-call"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-secondary w-full justify-center text-sm uppercase tracking-wider font-mono-code"
          >
            <PhoneCall className="w-4 h-4 text-[#E10600]" />
            Book a Call (30 Min)
          </a>
          <a
            href="#brief"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-primary w-full justify-center text-sm uppercase tracking-wider font-mono-code"
          >
            Start Project Brief
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <div className="text-xs text-[#8E8E93] text-center mt-2 font-mono-code">
            {STUDIO_CONFIG.email} &bull; {STUDIO_CONFIG.location}
          </div>
        </div>
      </div>
    </>
  );
}
