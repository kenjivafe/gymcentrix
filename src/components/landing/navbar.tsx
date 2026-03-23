import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";

const registerHref = "/register" as Route;
const dashboardHref = "/dashboard" as Route;

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl px-6 lg:px-14">
      <nav className="flex items-center justify-between py-2.5 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-3 sm:gap-4 group cursor-pointer transition-transform hover:scale-[1.02] active:scale-95">
          <Image 
            src="/app/gymcentrix-logo.png" 
            alt="Gymcentrix" 
            width={160} 
            height={40} 
            className="h-7 sm:h-8 w-auto logo-glow" 
            priority 
          />
          <span className="text-lg sm:text-2xl font-display font-bold tracking-tighter text-white group-hover:text-primary transition-colors text-glow text-shadow-glow">
            GYMCENTRIX
          </span>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-white/70 font-sans uppercase tracking-widest">
          <Link href="#" className="hover:text-primary transition">Features</Link>
          <Link href="#" className="hover:text-primary transition">Pricing</Link>
          <Link href="#" className="hover:text-primary transition">Enterprise</Link>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href={dashboardHref} className="hidden sm:block text-sm font-medium hover:text-primary transition font-sans uppercase tracking-widest">Sign In</Link>
          <Link
            href={registerHref}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 sm:px-8 sm:py-3.5 text-[10px] sm:text-sm font-bold text-black hover:scale-105 active:scale-95 transition shadow-glow-strong uppercase tracking-widest"
          >
            <span className="hidden sm:inline">Book a call</span>
            <span className="sm:hidden">Join Now</span>
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
