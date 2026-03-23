"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Solution", href: "#solution" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      {/* Background layer that covers the safe area */}
      <div 
        className={`absolute inset-0 border-b border-white/5 bg-black/20 backdrop-blur-xl transition-opacity duration-500 ${
          isMenuOpen ? "opacity-0" : "opacity-100"
        }`} 
      />

      {/* Navbar Content Container */}
      <div className="relative z-[110] px-6 lg:px-14 pt-[env(safe-area-inset-top)]">
        <nav className="flex items-center justify-between py-2.5 mx-auto max-w-7xl">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="flex items-center gap-3 sm:gap-4 group cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
          >
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-white/70 font-sans uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="hover:text-primary transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#pricing"
              onClick={closeMenu}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 sm:px-8 sm:py-3.5 text-[10px] sm:text-sm font-bold text-canvas hover:scale-105 active:scale-95 transition shadow-glow-strong uppercase tracking-[0.2em]"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-white hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 animate-in fade-in spin-in-90 duration-300" />
              ) : (
                <Menu className="w-6 h-6 animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[120] bg-black/60 backdrop-blur-3xl transition-all duration-700 md:hidden pt-[env(safe-area-inset-top)] ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-[-10%]"
        }`}
      >
        <div className="flex flex-col items-center pt-24 h-full gap-8 px-8 overflow-y-auto">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className={`text-2xl font-display font-bold tracking-tighter text-white hover:text-primary transition-all duration-500 transform ${
                isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <span className="text-white/10 text-lg font-sans tracking-[0.3em] font-medium leading-none mb-1">{String(i + 1).padStart(2, '0')}</span>
                {link.name}
              </div>
            </Link>
          ))}
          
          <div className={`w-full max-w-[280px] h-px bg-white/5 mt-4 transition-all duration-700 delay-[400ms] ${isMenuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
          
          <Link
            href="#pricing"
            onClick={closeMenu}
            className={`mt-4 inline-flex items-center gap-3 rounded-2xl bg-primary px-12 py-5 text-sm font-bold text-canvas hover:scale-105 active:scale-95 transition-all duration-500 shadow-glow-strong uppercase tracking-[0.2em] ${
              isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${navLinks.length * 100 + 100}ms` }}
          >
            <span>Get Started Now</span>
            <ArrowUpRight className="w-5 h-5 stroke-[3px]" />
          </Link>
          
          <div 
            className={`mt-auto mb-12 text-white/30 text-[10px] uppercase tracking-[0.4em] font-medium transition-opacity duration-700 delay-[600ms] ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          >
            © 2026 Gymcentrix
          </div>
        </div>
      </div>
    </header>
    </header>
  );
}
