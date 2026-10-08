"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TIMELINE_MILESTONES } from "@/content/studio";

export default function AboutTimeline() {
  return (
    <section id="about" className="relative z-10 scroll-mt-24 bg-[#FAF9F7] py-36 sm:py-48 lg:py-64 text-black">
      {/* Background soft blush glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#FFD1DC]/30 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Studio Genesis & Evolution
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
            Born From Cameras. Elevated By Code.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-black/60 sm:text-lg lg:text-xl">
            Red Studios was forged on a single conviction: the best creative visual work should never be separated from the digital architecture that sells it.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative mt-28 lg:mt-40">
          {/* Vertical Hairline Spine */}
          <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-black/20 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-32 sm:space-y-44 lg:space-y-56">
            {TIMELINE_MILESTONES.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.year}
                  className={`relative flex flex-col items-start md:flex-row ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Node on Spine */}
                  <div className="absolute left-4 top-8 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-black bg-white shadow-sm md:left-1/2">
                    <span className="h-2 w-2 rounded-full bg-black" />
                  </div>

                  {/* Spacer for 2-column alternating layout */}
                  <div className="hidden w-1/2 md:block" />

                  {/* Milestone Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`ml-12 w-[calc(100%-3rem)] md:ml-0 md:w-1/2 ${
                      isEven ? "md:pr-20" : "md:pl-20"
                    }`}
                  >
                    <div className="group rounded-3xl border border-black/[0.08] bg-white p-10 sm:p-14 shadow-sm transition-all duration-300 hover:border-black/30 hover:shadow-xl">
                      {/* Year & Title Tag */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="rounded-full bg-black px-4 py-1 font-mono text-xs font-semibold text-white">
                          {item.year}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-wider text-black/40">
                          {item.title}
                        </span>
                      </div>

                      {/* Headline */}
                      <h3 className="mt-6 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-black">
                        {item.headline}
                      </h3>

                      {/* Description */}
                      <p className="mt-4 text-sm leading-relaxed text-black/70">
                        {item.description}
                      </p>

                      {/* Highlight callout badge in soft blush */}
                      {item.highlight && (
                        <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-pink-200/60 bg-[#FFE4E9]/50 px-4 py-2.5">
                          <Sparkles className="h-3.5 w-3.5 shrink-0 text-black" />
                          <span className="font-mono text-xs font-medium text-black/80">
                            {item.highlight}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
