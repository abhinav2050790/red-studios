import React from "react";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import FluidHero from "@/components/FluidHero";
import InspoEditorialShowcase from "@/components/InspoEditorialShowcase";
import TrustStrip from "@/components/TrustStrip";
import Services from "@/components/Services";
import SelectedWork from "@/components/SelectedWork";
import AboutTimeline from "@/components/AboutTimeline";
import PhilosophyEthics from "@/components/PhilosophyEthics";
import ProcessFlow from "@/components/ProcessFlow";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BookCallSection from "@/components/BookCallSection";
import ProjectBriefForm from "@/components/ProjectBriefForm";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScrollProvider>
      {/* Interactive Custom Cursor Follower */}
      <CustomCursor />

      {/* Main Container */}
      <div className="relative min-h-screen bg-[#FFFFFF] text-[#0A0A0A] selection:bg-[#FFD1DC] selection:text-black">
        {/* Navigation Bar */}
        <Navigation />

        <main>
          {/* Section 1: Red Studios Interactive Navier-Stokes Fluid Reveal Hero */}
          <FluidHero />

          {/* Section 2: Exact Horizontal Magazine Presentation from inspo.mp4 */}
          <InspoEditorialShowcase />

          {/* Section 3: Trust Strip & Selected Partners Marquee */}
          <TrustStrip />

          {/* Section 4: Core Services & Disciplines */}
          <Services />

          {/* Section 5: Selected Work Portfolio Archive & Lightbox */}
          <SelectedWork />

          {/* Section 6: Studio Genesis & Evolution Timeline */}
          <AboutTimeline />

          {/* Section 7: Philosophy & Operating Ethics */}
          <PhilosophyEthics />

          {/* Section 8: 5-Phase Client Journey */}
          <ProcessFlow />

          {/* Section 9: Client Endorsements Carousel */}
          <TestimonialsCarousel />

          {/* Section 10: 30-Min Discovery Session Booking */}
          <BookCallSection />

          {/* Section 11: Multi-Step Project Intake Brief */}
          <ProjectBriefForm />

          {/* Section 12: Frequently Asked Questions */}
          <FAQAccordion />
        </main>

        {/* Section 13: Studio Editorial Footer */}
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
