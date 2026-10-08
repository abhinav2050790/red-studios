"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SELECTED_WORKS, WorkProject } from "@/content/studio";
import WorkLightbox from "./WorkLightbox";

type FilterKey = "all" | "product" | "editing" | "web";

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Projects" },
  { key: "product", label: "Product Shoots" },
  { key: "editing", label: "Commercial Edits" },
  { key: "web", label: "Web Platforms" },
];

export default function SelectedWork() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);

  const filteredProjects =
    activeFilter === "all"
      ? SELECTED_WORKS
      : SELECTED_WORKS.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="relative z-10 scroll-mt-24 bg-[#FFFFFF] py-36 sm:py-48 lg:py-60 text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              Lookbook Archive
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
              Selected Work & Stills.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-black/60 sm:text-lg">
              A curated selection of commercial cinematography, high-retention social edits, and high-performance digital architectures.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-full border border-black/10 bg-[#FAF9F7] p-1.5 max-w-full">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`relative rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-black/60 hover:text-black"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeWorkFilter"
                      className="absolute inset-0 rounded-full bg-black shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="mt-24 lg:mt-32 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => setSelectedProject(project)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-black/[0.08] bg-[#FAF9F7] transition-all duration-500 hover:-translate-y-1.5 hover:border-black/30 hover:shadow-xl"
              >
                {/* Media Image Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/10">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Metric Ribbon */}
                  {project.metrics && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1 backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-white" />
                      <span className="font-mono text-[11px] font-semibold text-white">
                        {project.metrics}
                      </span>
                    </div>
                  )}

                  {/* Corner Expand Action Button */}
                  <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black text-white shadow-md transition-all duration-300 group-hover:scale-110">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Category & Year */}
                  <div className="flex items-center justify-between text-xs text-black/50">
                    <span className="font-mono uppercase tracking-wider text-black font-semibold">
                      {project.categoryLabel}
                    </span>
                    <span className="font-mono text-black/40">{project.year}</span>
                  </div>

                  {/* Title & Client */}
                  <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-black">
                    {project.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-black/50">
                    {project.client}
                  </p>

                  {/* Description preview */}
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-black/70">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-black/10 bg-white px-3 py-1 font-mono text-[10px] text-black/60 shadow-xs"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <WorkLightbox
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
