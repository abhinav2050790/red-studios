"use client";

import React from "react";
import { motion } from "framer-motion";
import { TRUST_METRICS, TRUST_LOGOS } from "@/content/studio";

export default function TrustStrip() {
  const marqueeLogos = [...TRUST_LOGOS, ...TRUST_LOGOS, ...TRUST_LOGOS];

  return (
    <section className="relative z-10 border-y border-black/[0.08] bg-[#FFFFFF] py-20 sm:py-36 lg:py-44 text-black">
      {/* Subtle soft blush glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-[#FFE4E9]/60 to-transparent blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Marquee Header / Intro */}
        <div className="mb-10 sm:mb-12 lg:mb-16 flex flex-col items-center justify-between gap-4 sm:gap-6 border-b border-black/[0.08] pb-6 sm:pb-8 sm:flex-row text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-black" />
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/60">
              Trusted By Disruptive Brands & Founders
            </p>
          </div>
          <p className="font-mono text-xs text-black/40">
            Selected Partners & Commercial Commissions
          </p>
        </div>

        {/* Infinite Logo Marquee */}
        <div className="relative mb-16 sm:mb-24 lg:mb-32 overflow-hidden py-4 sm:py-6">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 sm:w-24 bg-gradient-to-r from-[#FFFFFF] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 sm:w-24 bg-gradient-to-l from-[#FFFFFF] to-transparent" />

          <motion.div
            className="flex w-max items-center gap-8 sm:gap-16 will-change-transform"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {marqueeLogos.map((logo, idx) => (
              <div
                key={`${logo.name}-${idx}`}
                className="group flex items-center gap-4 rounded-xl border border-black/[0.08] bg-[#FAF9F7] px-8 py-4 transition-colors hover:border-[#FFD1DC] hover:bg-[#FFF5F7]"
              >
                <span className="font-mono text-xs font-semibold tracking-wider text-black/50 transition-colors group-hover:text-black">
                  {logo.symbol}
                </span>
                <span className="font-sans text-sm font-semibold tracking-widest text-black/80 transition-colors group-hover:text-black">
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 4 Trust Metrics Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {TRUST_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl border border-black/[0.08] bg-gradient-to-b from-[#FFF5F7]/80 to-[#FFFFFF] p-8 sm:p-10 transition-all duration-300 hover:border-black/30 hover:shadow-lg"
            >
              {/* Corner soft blush accent */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-[#FFD1DC]/40 blur-xl transition-all duration-500 group-hover:bg-[#FFD1DC]/70" />

              <div className="mb-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-black">
                {metric.value}
              </div>
              <h3 className="font-sans text-sm font-bold tracking-wide uppercase text-black/90">
                {metric.label}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-black/60">
                {metric.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
