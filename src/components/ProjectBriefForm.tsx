"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  briefFormSchema,
  BriefFormData,
  SERVICE_OPTIONS,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  HEARD_ABOUT_OPTIONS,
} from "@/types/brief";

export default function ProjectBriefForm() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [serverStatus, setServerStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BriefFormData>({
    resolver: zodResolver(briefFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      websiteOrSocial: "",
      services: [],
      projectDescription: "",
      deliverablesCount: "",
      referenceLinks: "",
      budgetRange: "",
      timeline: "",
      heardAboutUs: "",
      consentAgreed: false,
      botCheckField: "",
    },
  });

  const selectedServices = watch("services") || [];
  const selectedBudget = watch("budgetRange");
  const selectedTimeline = watch("timeline");

  const toggleService = (service: string) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    setValue("services", updated, { shouldValidate: true });
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const valid = await trigger(["fullName", "email", "companyName"]);
      if (valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await trigger(["services", "projectDescription"]);
      if (valid) setCurrentStep(3);
    }
  };

  const onSubmit = async (data: BriefFormData) => {
    setServerStatus(null);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setServerStatus({
          success: true,
          message: result.message || "Project brief received. We will respond within 24 hours.",
        });
      } else {
        setServerStatus({
          success: false,
          message: result.error || "Submission error. Please email us directly at hello@redstudios.com",
        });
      }
    } catch {
      setServerStatus({
        success: false,
        message: "Network error occurred. Please check your connection or contact hello@redstudios.com directly.",
      });
    }
  };

  return (
    <section id="brief" className="relative z-10 scroll-mt-24 bg-[#FAF9F7] py-24 sm:py-48 lg:py-64 text-black">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.04] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Structured Intake
          </div>
          <h2 className="font-serif text-2xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black leading-tight">
            Start Your Project Brief.
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed text-black/60">
            Tell us about your brand and what you aim to achieve. Receive a comprehensive, fixed-scope estimate within 24 hours.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="relative mt-14 sm:mt-20 lg:mt-24 overflow-hidden rounded-3xl border border-black/10 bg-white p-5 sm:p-16 lg:p-20 shadow-xl">
          {/* Success State */}
          {serverStatus?.success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-white shadow-lg">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="mt-6 font-serif text-3xl font-bold text-black sm:text-4xl">
                Brief Received Successfully
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-black/70">
                {serverStatus.message} A copy of your submission details has also been scheduled for your inbox.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#FAF9F7] px-5 py-2 font-mono text-xs text-black/70">
                <Clock className="h-3.5 w-3.5 text-black" />
                <span>Guaranteed Review Time: Within 24 Hours</span>
              </div>
              <div className="mt-10">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setServerStatus(null);
                    setCurrentStep(1);
                  }}
                  className="rounded-full bg-black px-8 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-85 cursor-pointer"
                >
                  Submit Another Brief
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step Progress Bar */}
              <div className="mb-12">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-wider text-black font-semibold">
                    Step {currentStep} of 3:{" "}
                    {currentStep === 1
                      ? "About You"
                      : currentStep === 2
                      ? "Project Scope"
                      : "Timeline & Budget"}
                  </span>
                  <span className="font-mono text-black/40">
                    {currentStep === 1 ? "33%" : currentStep === 2 ? "66%" : "100%"}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                  <motion.div
                    className="h-full bg-black"
                    initial={{ width: "33%" }}
                    animate={{
                      width:
                        currentStep === 1
                          ? "33%"
                          : currentStep === 2
                          ? "66%"
                          : "100%",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Server Error Alert */}
              {serverStatus && !serverStatus.success && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-50 p-4 text-xs text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                  <span>{serverStatus.message}</span>
                </div>
              )}

              {/* Honeypot Spam Trap */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                {...register("botCheckField")}
              />

              {/* STEP 1: ABOUT YOU */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Elena Rostova"
                        {...register("fullName")}
                        className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder-black/30 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        placeholder="elena@company.com"
                        {...register("email")}
                        className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder-black/30 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Company / Brand */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                        Company or Brand *
                      </label>
                      <input
                        type="text"
                        placeholder="Velocity Performance"
                        {...register("companyName")}
                        className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder-black/30 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>

                    {/* Phone / WhatsApp */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...register("phone")}
                        className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder-black/30 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  {/* Website / Instagram URL */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                      Existing Website or Instagram URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://velocitybrand.com or @velocity"
                      {...register("websiteOrSocial")}
                      className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder-black/30 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PROJECT SCOPE */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Services Multi-Select Chips */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                      Services Needed * (Select all that apply)
                    </label>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {SERVICE_OPTIONS.map((srv) => {
                        const isSelected = selectedServices.includes(srv);
                        return (
                          <button
                            type="button"
                            key={srv}
                            onClick={() => toggleService(srv)}
                            className={`rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-black bg-black text-white shadow-sm"
                                : "border-black/15 bg-white text-black/70 hover:border-black hover:text-black"
                            }`}
                          >
                            {srv}
                          </button>
                        );
                      })}
                    </div>
                    {errors.services && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.services.message}
                      </p>
                    )}
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                      Project Objective & Description * (Minimum 20 characters)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what you are launching, what kind of imagery or digital experience you require..."
                      {...register("projectDescription")}
                      className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder-black/30 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    {errors.projectDescription && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.projectDescription.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Deliverables Count */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                        Deliverable Quantity (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 hero product films, 20 stills, 1 landing page"
                        {...register("deliverablesCount")}
                        className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder-black/30 transition-all focus:border-black focus:outline-none"
                      />
                    </div>

                    {/* Reference Links */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                        Inspiration / Reference URLs (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Links to Vimeo, Pinterest, reference sites"
                        {...register("referenceLinks")}
                        className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black placeholder-black/30 transition-all focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: TIMELINE, BUDGET & CONSENT */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Budget Ranges */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                      Estimated Project Budget *
                    </label>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {BUDGET_RANGES.map((b) => {
                        const isSelected = selectedBudget === b;
                        return (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setValue("budgetRange", b, { shouldValidate: true })}
                            className={`rounded-2xl border px-4 py-3 text-center font-mono text-xs transition-all cursor-pointer ${
                              isSelected
                                ? "border-black bg-black text-white shadow-sm"
                                : "border-black/15 bg-white text-black/70 hover:border-black hover:text-black"
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                    {errors.budgetRange && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.budgetRange.message}
                      </p>
                    )}
                  </div>

                  {/* Target Timeline */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                      Target Launch Timeline *
                    </label>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {TIMELINE_OPTIONS.map((t) => {
                        const isSelected = selectedTimeline === t;
                        return (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setValue("timeline", t, { shouldValidate: true })}
                            className={`rounded-2xl border px-4 py-3 text-left font-mono text-xs transition-all cursor-pointer ${
                              isSelected
                                ? "border-black bg-black text-white shadow-sm"
                                : "border-black/15 bg-white text-black/70 hover:border-black hover:text-black"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                    {errors.timeline && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.timeline.message}
                      </p>
                    )}
                  </div>

                  {/* How Did You Hear About Us */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-black/70">
                      How Did You Hear About Us? (Optional)
                    </label>
                    <select
                      {...register("heardAboutUs")}
                      className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 font-sans text-sm text-black focus:border-black focus:outline-none"
                    >
                      <option value="">Select source...</option>
                      {HEARD_ABOUT_OPTIONS.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("consentAgreed")}
                        className="mt-1 h-4 w-4 rounded border-black/20 text-black focus:ring-black"
                      />
                      <span className="text-xs leading-relaxed text-black/70">
                        I agree to share this project brief with Red Studios for the purpose of receiving an architectural quote and timeline proposal. We respect your confidentiality.
                      </span>
                    </label>
                    {errors.consentAgreed && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.consentAgreed.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
                    className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-3 font-mono text-xs uppercase tracking-wider text-black transition-colors hover:border-black cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-black/85 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-full bg-black px-9 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-black/85 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Brief...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
