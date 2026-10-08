"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import { PROCESS_STEPS } from "@/content/studio";

export default function ProcessFlow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="relative z-10 scroll-mt-24 bg-[#FFFFFF] py-36 sm:py-48 lg:py-60 text-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Client Journey
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
            5 Structured Phases. Zero Guesswork.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-black/60 sm:text-lg lg:text-xl">
            From initial creative concept to global live deployment. Guaranteed milestones, live staging previews, and transparent pricing.
          </p>
        </div>

        {/* Desktop Step Nav / Selector */}
        <div className="mt-24 lg:mt-32 hidden grid-cols-5 gap-4 lg:grid">
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`group relative flex flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-black bg-[#FFF0F3] shadow-md"
                    : "border-black/[0.08] bg-[#FAF9F7] hover:border-black/30 hover:bg-white"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? "text-black" : "text-black/40"
                    }`}
                  >
                    PHASE {step.step}
                  </span>
                  <span className="font-mono text-[11px] text-black/40">
                    {step.duration}
                  </span>
                </div>
                <div
                  className={`mt-4 font-sans text-sm font-bold tracking-tight transition-colors ${
                    isActive ? "text-black" : "text-black/70 group-hover:text-black"
                  }`}
                >
                  {step.title.split("&")[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Showcase (Desktop) */}
        <div className="mt-12 lg:mt-16 hidden lg:block">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-pink-200/60 bg-gradient-to-br from-[#FFE4E9]/70 via-[#FFF0F3]/60 to-[#FFE6D9]/70 p-12 sm:p-16 lg:p-20 shadow-md backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-black/60 font-semibold">
                Phase {PROCESS_STEPS[activeStep].step} of 05
              </span>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 font-mono text-xs text-black/80 shadow-xs">
                <Clock className="h-3.5 w-3.5 text-black" />
                {PROCESS_STEPS[activeStep].duration}
              </div>
            </div>

            <h3 className="mt-6 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black">
              {PROCESS_STEPS[activeStep].title}
            </h3>

            <p className="mt-6 max-w-4xl text-base leading-relaxed text-black/70 sm:text-lg">
              {PROCESS_STEPS[activeStep].summary}
            </p>

            <div className="mt-12 border-t border-black/10 pt-8">
              <h4 className="font-mono text-xs uppercase tracking-widest text-black/50">
                Phase Deliverables & Artifacts
              </h4>
              <div className="mt-6 flex flex-wrap gap-4">
                {PROCESS_STEPS[activeStep].deliverables.map((d, dIdx) => (
                  <div
                    key={dIdx}
                    className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-5 py-2.5 font-mono text-xs text-black/90 shadow-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-black" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile / Tablet Vertical Flow */}
        <div className="mt-12 space-y-6 lg:hidden">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="rounded-3xl border border-black/[0.08] bg-[#FAF9F7] p-8 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-black">
                  PHASE {step.step}
                </span>
                <span className="font-mono text-xs text-black/40">{step.duration}</span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-black">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-black/70">
                {step.summary}
              </p>
              <div className="mt-6 space-y-2 border-t border-black/[0.08] pt-4">
                {step.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-xs text-black/70">
                    <CheckCircle2 className="h-3.5 w-3.5 text-black" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
