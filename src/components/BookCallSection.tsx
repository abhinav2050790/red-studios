"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Mail, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";
import { STUDIO_CONFIG } from "@/content/studio";
import { getBookingLinks } from "@/utils/booking";

export default function BookCallSection() {
  const [copied, setCopied] = useState(false);
  const { gmailComposeUrl, mailtoUrl, toEmail } = getBookingLinks();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(toEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="call" className="relative z-10 scroll-mt-24 bg-[#FFFFFF] py-24 sm:py-48 lg:py-64 text-black">
      {/* Subtle background blush aura */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,209,220,0.35),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-pink-200/60 bg-gradient-to-br from-[#FFE4E9] via-[#FFF0F3] to-[#FFE6D9] p-6 sm:p-16 lg:p-24 shadow-xl">
          <div className="relative text-center">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/80 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black shadow-xs">
              <Calendar className="h-3.5 w-3.5" />
              Direct Studio Access
            </div>

            {/* Headline */}
            <h2 className="mt-8 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
              Ready To Elevate Your Brand? <br className="hidden sm:inline" />
              <span>Let&apos;s talk in 30 minutes.</span>
            </h2>

            {/* Reassurance Subtitle */}
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-black/70 sm:text-lg lg:text-xl">
              No junior account managers. No generic pitch decks. Speak directly with our creative directors and lead engineers to map your production or digital launch.
            </p>

            {/* 3 Reassurance Value Props */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-black/80 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-black" />
                <span>30 minutes • High-value brainstorm</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-black" />
                <span>Free architectural & visual audit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-black" />
                <span>Guaranteed fixed quote within 24h</span>
              </div>
            </div>

            {/* Direct Booking Action Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* Primary: Gmail Compose Web Link in Black Pill */}
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-black px-9 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-black/85 hover:scale-[1.02] sm:w-auto cursor-pointer"
              >
                <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Launch Discovery Call (Gmail)</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Fallback Mailto */}
              <a
                href={mailtoUrl}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-7 font-sans text-xs font-semibold uppercase tracking-wider text-black shadow-xs transition-all duration-200 hover:bg-black hover:text-white sm:w-auto cursor-pointer"
              >
                <span>Or Open Default Mail Client</span>
              </a>
            </div>

            {/* Studio Email Copy helper */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <span className="font-mono text-xs text-black/50">Studio Dispatch:</span>
              <button
                onClick={handleCopyEmail}
                className="group flex items-center gap-2 rounded-lg border border-black/10 bg-white/70 px-3.5 py-1.5 font-mono text-xs text-black/80 transition-colors hover:border-black cursor-pointer"
              >
                <span>{toEmail}</span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-black/50 group-hover:text-black" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
