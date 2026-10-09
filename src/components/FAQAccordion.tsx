"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/content/studio";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative z-10 scroll-mt-24 bg-[#FFFFFF] py-24 sm:py-48 lg:py-60 text-black">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black">
            <HelpCircle className="h-3.5 w-3.5" />
            Transparent Answers
          </div>
          <h2 className="font-serif text-2xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
            Frequently Asked Questions.
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed text-black/60">
            Everything you need to know about working with Red Studios, from turnaround schedules and deliverables to tech stack specifications.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-16 sm:mt-24 lg:mt-32 space-y-4 sm:space-y-8">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-3xl border border-black/[0.08] bg-[#FAF9F7] transition-all duration-300 hover:border-black/30"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  className="touch-press flex w-full items-center justify-between p-5 sm:p-9 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-6">
                    <span className="font-mono text-xs sm:text-sm font-bold text-black/40">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-serif text-base sm:text-2xl font-bold text-black leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-black text-white" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-black/[0.06] px-7 sm:px-9 pb-8 pt-6">
                        <p className="text-sm leading-relaxed text-black/70">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom prompt */}
        <div className="mt-16 text-center">
          <p className="font-mono text-xs text-black/50">
            Have a custom requirement or proprietary hardware NDA?{" "}
            <a
              href="#call"
              className="text-black font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Ask us directly on a discovery call.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
