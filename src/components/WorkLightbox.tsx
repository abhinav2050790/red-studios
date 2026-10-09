"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Sparkles, Tag, Calendar, User } from "lucide-react";
import Image from "next/image";
import { WorkProject } from "@/content/studio";

interface WorkLightboxProps {
  project: WorkProject | null;
  onClose: () => void;
}

export default function WorkLightbox({ project, onClose }: WorkLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 lg:p-8"
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container: Native Bottom Sheet on Mobile, Centered Card on Desktop */}
          <motion.div
            initial={{ scale: 0.96, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative z-10 max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl sm:rounded-3xl border-t sm:border border-black/10 bg-white text-black shadow-2xl pb-safe"
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="sm:hidden flex justify-center py-2.5">
              <div className="w-12 h-1 bg-black/20 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close project modal"
              className="touch-press absolute right-3.5 top-3.5 sm:right-5 sm:top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/95 text-black shadow-md transition-colors hover:bg-black hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Media Preview Header */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover grayscale contrast-125"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Metric Badge */}
              {project.metrics && (
                <div className="absolute bottom-3 left-4 sm:bottom-5 sm:left-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-3.5 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                  <span className="font-mono text-[11px] sm:text-xs font-semibold text-white">
                    {project.metrics}
                  </span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-12">
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-black/50">
                <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider text-black font-semibold">
                  <Tag className="h-3.5 w-3.5" />
                  {project.categoryLabel}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <User className="h-3.5 w-3.5" />
                  {project.client}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <Calendar className="h-3.5 w-3.5" />
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <h2
                id="lightbox-title"
                className="mt-4 font-serif text-2xl sm:text-4xl font-bold tracking-tight text-black"
              >
                {project.title}
              </h2>

              {/* Detailed Description */}
              <p className="mt-4 text-base leading-relaxed text-black/70">
                {project.description}
              </p>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-[#FAF9F7] px-3.5 py-1 font-mono text-xs text-black/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row">
                <p className="font-mono text-xs text-black/50">
                  Ready to achieve similar benchmark results for your launch?
                </p>
                <a
                  href="#brief"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-black/80 cursor-pointer"
                >
                  <span>Start A Project Like This</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
