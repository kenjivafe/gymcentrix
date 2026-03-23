"use client";

import React from "react";
import { Navbar } from "./navbar";
import { HeroSection } from "./hero-section";
import { Marquee } from "./marquee";
import { ProblemSection } from "./problem-section";
import { RfidAnimationSection } from "./rfid-animation";
import { DashboardPreview } from "./dashboard-preview";
import { WhoIsItFor } from "./who-is-it-for";
import { PricingSection } from "./pricing-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="relative text-white bg-canvas min-h-screen font-sans bg-grid overflow-x-clip">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 bg-mesh-glow pointer-events-none" aria-hidden />
      
      <Navbar />
      <main className="relative z-10 pt-[calc(60px+env(safe-area-inset-top))] sm:pt-[calc(72px+env(safe-area-inset-top))]">
        <HeroSection />
        <Marquee />
        <ProblemSection />
        <RfidAnimationSection />
        <DashboardPreview />
        <WhoIsItFor />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
