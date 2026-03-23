import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Send, 
  Github, 
  Twitter, 
  Linkedin 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-xl overflow-hidden px-[clamp(1rem,5vw,3.5rem)] pb-[env(safe-area-inset-bottom)]">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-end pb-32 lg:pb-0 justify-center pointer-events-none opacity-[0.02] select-none">
        <span className="text-[12vw] font-display font-bold tracking-tighter leading-none">
          GYMCENTRIX
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl pt-24 pb-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-24">
          
          {/* Column 1: Identity */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 w-fit">
              <Image 
                src="/app/gymcentrix-logo.png" 
                alt="Gymcentrix" 
                width={160} 
                height={40} 
                className="h-8 w-auto logo-glow" 
              />
              <span className="text-xl font-display font-bold tracking-tighter text-white group-hover:text-primary transition-colors text-glow">
                GYMCENTRIX
              </span>
            </Link>
            <div className="space-y-2 text-sm font-sans font-medium tracking-widest text-white/40 uppercase">
              <p>The Operating System for Modern Gyms.</p>
              <p>Kalinga, Philippines.</p>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-white/50 font-sans uppercase tracking-widest">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Analytics</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">RFID Tech</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Automation</Link></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-white/50 font-sans uppercase tracking-widest">
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Partners</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Pipeline & Socials */}
          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Updates</h4>
            <div className="space-y-6">
              <p className="text-sm font-medium text-white/50 font-sans leading-relaxed">
                Join our newsletter for the latest in fitness tech.
              </p>
              <div className="relative group max-w-xs">
                <input 
                  type="email" 
                  placeholder="EMAIL@GYM.COM" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-primary transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-6">
                <Link href="#" className="text-white/40 hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-white/40 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-white/40 hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Row */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-white/20 text-[10px] font-bold font-sans uppercase tracking-[0.3em] text-center">
            © {new Date().getFullYear()} GYMCENTRIX. For Gyms by Northernware.
          </p>
        </div>
      </div>
    </footer>
  );
}
