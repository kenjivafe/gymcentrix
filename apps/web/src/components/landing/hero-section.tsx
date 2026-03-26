import React from "react";
import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { PrimaryCta, SecondaryCta } from "./cta-buttons";


export function HeroSection() {
  return (
    <section className="relative px-6 pt-6 pb-24 lg:px-14 lg:pt-24 lg:pb-28 overflow-hidden">
      {/* Background Hero Image with Mask */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-canvas/40 z-10" aria-hidden />
        <Image 
          src="/app/gymcentrix-hero.jpg" 
          alt="" 
          fill
          className="object-cover opacity-15 grayscale-[0.2]"
          style={{ 
            maskImage: 'radial-gradient(circle at 60% 40%, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 60% 40%, black, transparent 80%)'
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-24 items-center">
        {/* Left Side: Text Content */}
        <div className="text-center lg:text-left space-y-6 lg:space-y-12 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-[10px] lg:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] text-primary font-bold mx-auto lg:mx-0">
            <Dumbbell className="w-4 h-4" /> Professional Gym Management
          </div>
          <h1 className="text-5xl uppercase font-display font-bold tracking-tighter leading-[1.1] sm:text-8xl lg:text-6xl xl:text-7xl">
            The OS for <br className="hidden sm:block" />
            <span className="text-primary text-glow italic">Modern Gyms.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/50 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Gymcentrix empowers owners with a unified platform for billing, analytics, and member engagement. 
            Automate the boring stuff and focus on building your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 px-4 sm:px-0">
            <PrimaryCta href="#">Book a call</PrimaryCta>
            <SecondaryCta href="#features">Learn More</SecondaryCta>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-6 pt-12 border-t border-white/5 max-w-xs mx-auto lg:mx-0">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-canvas bg-white/5" aria-hidden />
              ))}
            </div>
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
              Trusted by <span className="text-white">50+</span> <br /> Gyms Nationwide
            </p>
          </div>
        </div>
        {/* Right Side: Product Mockup */}
        <div className="relative order-1 lg:order-2 group px-12 lg:pl-10 mb-0 lg:mb-32 xl:mb-0">
          <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-[100px] opacity-20 group-hover:opacity-40 transition duration-1000" aria-hidden />
          <div className="relative transition-all duration-1000 [perspective:2000px] group-hover:[transform:rotateY(-15deg)rotateX(-15deg)]">
             <Image 
               src="/app/gymcentrix-mockup.png" 
               alt="Gymcentrix Platform Interface" 
               width={1200} 
               height={800} 
               className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-100 lg:scale-[1.15] origin-center"
               priority
             />
          </div>
        </div>
      </div>
    </section>
  );
}
