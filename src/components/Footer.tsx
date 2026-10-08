"use client";

import React from "react";
import { ArrowUp, Mail, Phone, MapPin } from "lucide-react";
import { STUDIO_CONFIG, NAV_LINKS } from "@/content/studio";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-black/[0.08] bg-[#FFFFFF] py-28 text-black sm:py-36 lg:py-44">
      {/* Subtle top blush hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-20">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-3">
              {/* Minimalist Key Glyphic SVG */}
              <svg
                className="w-8 h-8 text-black"
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
              <span className="font-serif text-2xl font-bold uppercase tracking-wider text-black">
                RED STUDIOS
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-black/60">
              {STUDIO_CONFIG.tagline}. We unite commercial cinema production with modern full-stack web engineering.
            </p>

            {/* Direct Contact List */}
            <div className="mt-8 space-y-3 font-mono text-xs text-black/60">
              <div className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 text-black" />
                <a
                  href={`mailto:${STUDIO_CONFIG.email}`}
                  className="transition-colors hover:text-black font-semibold"
                >
                  {STUDIO_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-3.5 w-3.5 text-black" />
                <a
                  href={`tel:${STUDIO_CONFIG.phone}`}
                  className="transition-colors hover:text-black"
                >
                  {STUDIO_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-3.5 w-3.5 text-black" />
                <span>{STUDIO_CONFIG.location}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-black font-bold">
              Editorial
            </h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-mono text-xs text-black/60 transition-colors hover:text-black"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Practices Quicklist */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-black font-bold">
              Disciplines
            </h4>
            <ul className="mt-5 space-y-3 font-mono text-xs text-black/60">
              <li>
                <a href="#services" className="transition-colors hover:text-black">
                  Product Photography
                </a>
              </li>
              <li>
                <a href="#services" className="transition-colors hover:text-black">
                  Commercial Cinematography
                </a>
              </li>
              <li>
                <a href="#services" className="transition-colors hover:text-black">
                  Advertisement Editing & Sound
                </a>
              </li>
              <li>
                <a href="#services" className="transition-colors hover:text-black">
                  Full-Stack Next.js Platforms
                </a>
              </li>
              <li>
                <a href="#services" className="transition-colors hover:text-black">
                  Interactive WebGL Landing Pages
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Action & Back to Top */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-black font-bold">
                Discovery Session
              </h4>
              <p className="mt-3 text-xs text-black/60">
                Ready to schedule your 30-min discovery session?
              </p>
              <div className="mt-5">
                <a
                  href="#call"
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-opacity hover:opacity-85 shadow-sm"
                >
                  Book Discovery Call
                </a>
              </div>
            </div>

            <div className="mt-10 pt-4">
              <button
                type="button"
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2 rounded-full border border-black/15 bg-[#FAF9F7] px-5 py-2.5 font-mono text-xs text-black transition-colors hover:bg-black hover:text-white cursor-pointer shadow-xs"
              >
                <span>Back to Top</span>
                <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 lg:mt-32 flex flex-col items-center justify-between gap-6 border-t border-black/[0.08] pt-12 sm:flex-row">
          <p className="font-mono text-xs text-black/50">
            © 2025 Red Studios production. All rights reserved.
          </p>
          <p className="font-mono text-xs text-black/40">
            Editorial Direction &bull; WebGL Fluid Physics &bull; DaVinci Resolve Master.
          </p>
        </div>
      </div>
    </footer>
  );
}
