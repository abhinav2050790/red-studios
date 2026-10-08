"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { PHILOSOPHY_PRINCIPLES, FOUNDER_QUOTE } from "@/content/studio";

export default function PhilosophyEthics() {
  return (
    <section id="ethics" className="relative z-10 scroll-mt-24 bg-[#FFFFFF] py-36 sm:py-48 lg:py-60 text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Operating Principles
          </div>
          <h2 className="font-serif text-2xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
            How We Work Is Who We Are.
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg lg:text-xl leading-relaxed text-black/60">
            We don’t believe in fluff, inflated retainer hours, or compromised creative standards.
            Six rules guide every shoot, every cut, and every commit.
          </p>
        </div>

        {/* 6 Principles Grid */}
        <div className="mt-16 sm:mt-24 lg:mt-32 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {PHILOSOPHY_PRINCIPLES.map((principle, idx) => (
            <motion.div
              key={principle.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-[#FAF9F7] p-6 sm:p-12 shadow-sm transition-all duration-300 hover:border-black/30 hover:shadow-xl hover:bg-white"
            >
              {/* Corner soft blush accent */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-[#FFD1DC]/40 blur-2xl transition-all duration-500 group-hover:bg-[#FFD1DC]/70" />

              <div>
                {/* Number indicator */}
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                  Principle {principle.number}
                </div>

                {/* Title */}
                <h3 className="mt-5 font-serif text-xl sm:text-2xl font-bold text-black">
                  {principle.title}
                </h3>

                {/* Summary */}
                <p className="mt-2 font-mono text-xs text-black/50">
                  {principle.summary}
                </p>

                {/* Full description */}
                <p className="mt-4 text-sm leading-relaxed text-black/70">
                  {principle.description}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-8 h-[2px] w-8 bg-black/20 transition-all duration-300 group-hover:w-16 group-hover:bg-black" />
            </motion.div>
          ))}
        </div>

        {/* Founder Quote Card Styled in Inspo Blush Pastel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-24 sm:mt-32 overflow-hidden rounded-3xl border border-pink-200/60 bg-gradient-to-r from-[#FFE4E9] via-[#FFF0F3] to-[#FFE6D9] p-10 sm:p-16 lg:p-20 shadow-lg"
        >
          <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-md">
              <Quote className="h-7 w-7" />
            </div>

            <div className="flex-1">
              <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-black">
                &ldquo;{FOUNDER_QUOTE.quote}&rdquo;
              </p>
              <div className="mt-6 flex flex-col items-center gap-1 sm:flex-row sm:gap-3 lg:items-start">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                  {FOUNDER_QUOTE.author}
                </span>
                <span className="hidden text-black/30 sm:inline">•</span>
                <span className="font-mono text-xs text-black/60">
                  {FOUNDER_QUOTE.role}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
