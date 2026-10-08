"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Film, Code2, Layout, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { SERVICES } from "@/content/studio";

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Film,
  Code2,
  Layout,
};

export default function Services() {
  return (
    <section id="services" className="relative z-10 scroll-mt-24 bg-[#FFFFFF] py-36 sm:py-48 lg:py-60 text-black">
      {/* Background ambient blush gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,209,220,0.3),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Core Disciplines
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
            Prêt-à-porter Visuals & Code.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-black/60 sm:text-lg lg:text-xl">
            We bridge the gap between high-fashion film cinematography and modern full-stack web engineering.
            Four dedicated practices under one singular creative standard.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="mt-24 lg:mt-32 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
          {SERVICES.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Camera;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.08] bg-gradient-to-b from-[#FFF5F7] via-[#FFFFFF] to-[#FAF9F7] p-10 sm:p-14 lg:p-16 shadow-sm transition-all duration-300 hover:border-black/30 hover:shadow-xl"
              >
                {/* Soft pink highlight glow */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#FFD1DC]/40 blur-3xl transition-all duration-500 group-hover:bg-[#FFD1DC]/70" />

                <div>
                  {/* Top Bar: Icon + Turnaround Badge */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-white text-black shadow-sm transition-colors duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                      <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1 font-mono text-xs text-black/60 shadow-sm">
                      <Clock className="h-3 w-3 text-black" />
                      <span>{service.timeline}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="mt-8 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-black">
                    {service.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-wider text-black/50">
                    {service.subtitle}
                  </p>

                  {/* Body description */}
                  <p className="mt-5 text-sm leading-relaxed text-black/70">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="mt-8 border-t border-black/[0.08] pt-8">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-black/40">
                      Key Deliverables
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {service.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-3 text-xs text-black/80">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer: CTA */}
                <div className="mt-10 pt-4">
                  <a
                    href="#brief"
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-black hover:opacity-70 transition-opacity"
                  >
                    <span>Request Brief for {service.title.split(" ")[0]}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
