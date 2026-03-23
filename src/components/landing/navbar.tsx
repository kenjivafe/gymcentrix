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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl px-6 lg:px-14">
      <nav className="flex items-center justify-between py-2.5 mx-auto max-w-7xl">
        <Link 
          href="/" 
          onClick={closeMenu}
          className="flex items-center gap-3 sm:gap-4 group cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 z-50"
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
            className="hidden xs:inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 sm:px-8 sm:py-3.5 text-[10px] sm:text-sm font-bold text-canvas hover:scale-105 active:scale-95 transition shadow-glow-strong uppercase tracking-[0.2em]"
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:text-primary transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl transition-all duration-500 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className={`text-2xl font-display font-bold tracking-tighter text-white hover:text-primary transition-all duration-300 ${
                isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#pricing"
            onClick={closeMenu}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-sm font-bold text-canvas hover:scale-105 active:scale-95 transition shadow-glow-strong uppercase tracking-[0.2em] ${
              isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: `${navLinks.length * 100}ms` }}
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
