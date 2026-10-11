import React from "react";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import FluidHero from "@/components/FluidHero";
import CaptureExperience from "@/components/CaptureExperience";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#FFFFFF] text-[#0A0A0A]">
        <main>
          {/* Section 1: Red Studios Interactive Navier-Stokes Fluid Reveal Hero Animation Section */}
          <FluidHero />

          {/* Section 2: Exact CAPTURE Camera Showcase from Uploaded Video */}
          <CaptureExperience />
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
