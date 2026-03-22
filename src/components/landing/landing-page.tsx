"use client";

import { useRef, useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowUpRight, 
  Sparkles, 
  BarChart3, 
  Users, 
  CreditCard, 
  Zap, 
  ShieldCheck,
  Smartphone,
  Dumbbell,
  Github,
  Twitter,
  Linkedin,
  Send,
  ClipboardList,
  AlertCircle,
  UserSearch,
  Clock,
  CheckCircle2
} from "lucide-react";

const registerHref = "/register" as Route;
const dashboardHref = "/dashboard" as Route;

const features = [
  {
    title: "Owner Insights",
    description: "Real-time analytics on member churn, peak hours, and revenue growth. Command your gym with data.",
    icon: BarChart3,
  },
  {
    title: "Member Management",
    description: "Automated billing, digital contracts, and personalized growth tracking for every athlete.",
    icon: Users,
  },
  {
    title: "RFID Infrastructure",
    description: "Low-latency sign-in systems for members. Tap-and-go access that syncs instantly with your records.",
    icon: CreditCard,
  },
  {
    title: "Workflow Automation",
    description: "Reduce manual tasks by 60% with automated member onboarding and staff scheduling.",
    icon: Zap,
  },
];

export function LandingPage() {
  return (
    <div className="relative text-white bg-canvas min-h-screen font-sans bg-grid overflow-x-clip">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 bg-mesh-glow pointer-events-none" aria-hidden />
      
      <main className="relative z-10 pt-[72px] sm:pt-[88px]">
        <Navbar />
        <HeroSection />
        <Marquee />
        <ProblemSection />
        <RfidAnimationSection />
        <FeaturesGrid />
        <RfidHighlight />
        <CtaSection />
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-black/20 overflow-hidden px-6 lg:px-14">
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
    </div>
  );
}

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl px-6 lg:px-14">
      <nav className="flex items-center justify-between py-4 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-3 sm:gap-4 group cursor-pointer transition-transform hover:scale-[1.02] active:scale-95">
          <Image 
            src="/app/gymcentrix-logo.png" 
            alt="Gymcentrix" 
            width={160} 
            height={40} 
            className="h-8 sm:h-10 w-auto logo-glow" 
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
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 sm:px-8 sm:py-5 text-[10px] sm:text-sm font-bold text-black hover:scale-105 active:scale-95 transition shadow-glow-strong uppercase tracking-widest"
          >
            <span className="hidden sm:inline">Start Free trial</span>
            <span className="sm:hidden">Join Now</span>
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
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
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] text-primary font-bold mx-auto lg:mx-0">
            <Dumbbell className="w-4 h-4" /> Professional Gym Management
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tighter leading-[1.1] sm:text-8xl lg:text-6xl xl:text-7xl">
            The OS for <br className="hidden sm:block" />
            <span className="text-primary text-glow italic">Modern Gyms.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/50 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Gymcentrix empowers owners with a unified platform for billing, analytics, and member engagement. 
            Automate the boring stuff and focus on building your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 px-4 sm:px-0">
            <PrimaryCta href={registerHref}>Get Started Now</PrimaryCta>
            <SecondaryCta href={dashboardHref}>View Platform Demo</SecondaryCta>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-6 pt-12 border-t border-white/5 max-w-xs mx-auto lg:mx-0">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-canvas bg-white/5" aria-hidden />
              ))}
            </div>
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
              Trusted by <span className="text-white">200+</span> Studios
            </p>
          </div>
        </div>
        {/* Right Side: Product Mockup */}
        <div className="relative order-1 lg:order-2 group px-12 lg:pl-10 mb-0 lg:mb-0">
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

function Marquee() {
  const items = [
    "RFID Tap Check-In",
    "Automated Attendance",
    "Member Management",
    "Payment Tracking",
    "Real-Time Gym Insights",
    "Staff Tools",
    "Attendance Analytics"
  ];

  return (
    <div className="relative py-4 overflow-hidden bg-primary/5 border-y border-white/5 backdrop-blur-sm">
      <div className="flex animate-marquee whitespace-nowrap gap-12 sm:gap-24 items-center">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-4 sm:gap-6">
            <div className="w-1 h-1 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(135,241,0,0.3)]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              {item}
            </span>
          </div>
        ))}
      </div>
      
      {/* Edge Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-canvas to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-canvas to-transparent z-10" />
    </div>
  );
}

function RfidAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const blobsRef = useRef<{ [key: string]: string }>({});

  // Detect orientation change
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch / Switch based on orientation
  useEffect(() => {
    if (isMobile === null) return;
    
    const targetAsset = isMobile ? "/videos/RFID-animation-mobile.mp4" : "/videos/RFID-animation.mp4";
    
    // Use cached blob if available
    if (blobsRef.current[targetAsset]) {
      setVideoSrc(blobsRef.current[targetAsset]);
      return;
    }

    fetch(targetAsset)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        blobsRef.current[targetAsset] = url;
        setVideoSrc(url);
      })
      .catch(err => {
        console.error("Video blob fetch failed:", err);
        setVideoSrc(targetAsset); // Fallback
      });
  }, [isMobile]);

  // Cleanup all Object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(blobsRef.current).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.pause();

    let rafId: number;
    let targetProgress = 0;
    let currentProgress = 0;
    const lerpFactor = 0.08; // Adjusted for buttery smoothness

    const handleScroll = () => {
      if (!containerRef.current || !video.duration || isNaN(video.duration)) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const navOffset = viewHeight > 640 ? 88 : 72;
      const total = rect.height - viewHeight;
      
      let nextTarget = -rect.top / total;
      targetProgress = Math.min(Math.max(nextTarget, 0), 1);
    };

    const updateVideo = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * lerpFactor;
        if (video.readyState >= 2) {
          video.currentTime = currentProgress * video.duration;
        }

        // Apply scroll-triggered opacity to text (starts at 0.7, full at 0.95)
        if (textRef.current) {
          const textOpacity = Math.min(Math.max((currentProgress - 0.7) / 0.25, 0), 1);
          textRef.current.style.opacity = textOpacity.toString();
          textRef.current.style.transform = `translateY(${10 - textOpacity * 10}px)`;
        }
      }
      rafId = requestAnimationFrame(updateVideo);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(updateVideo);

    // Initial activation trick for some browsers
    const activateVideo = () => {
      video.play().then(() => video.pause());
      window.removeEventListener('touchstart', activateVideo);
      window.removeEventListener('click', activateVideo);
    };
    window.addEventListener('touchstart', activateVideo);
    window.addEventListener('click', activateVideo);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', activateVideo);
      window.removeEventListener('click', activateVideo);
      cancelAnimationFrame(rafId);
    };
  }, [videoSrc]);

  return (
    <section ref={containerRef} className="h-[300vh] relative bg-black">
      <div className="sticky top-[72px] sm:top-[88px] h-[calc(100vh-72px)] sm:h-[calc(100vh-88px)] w-full flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-60"
            />
          )}
          {/* Subtle Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-10 lg:opacity-80" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* Content Overlay */}
        <div 
          ref={textRef} 
          className="relative z-10 w-full px-6 lg:px-14 flex items-start md:items-center pt-6 md:pt-0 opacity-0 pointer-events-none transition-transform duration-300 ease-out h-full"
        >
           <div className="mx-auto max-w-7xl w-full">
             <div className="max-w-2xl text-left space-y-4 lg:space-y-8">
               <div className="space-y-4">
                 <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Seamless Integration</h3>
                 <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter text-white leading-tight">
                   Fast. Seamless. <br />
                   <span className="text-primary italic">Effortless.</span>
                 </h2>
               </div>
               <p className="text-lg md:text-2xl text-white/50 font-sans leading-relaxed">
                 Experience the future of gym access with lightning-fast RFID check-ins that keep your community moving.
               </p>
             </div>
           </div>
        </div>

        {/* Decorative Light Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      title: "Manual Attendance",
      description: "Staff still track check-ins using logbooks or paper sheets.",
      icon: ClipboardList,
      image: "/problems/manual-attendance.png"
    },
    {
      title: "Missed Payments",
      description: "Without a proper system, it's easy to lose track of memberships and payment dates.",
      icon: AlertCircle,
      image: "/problems/missed-payments.png"
    },
    {
      title: "Member Tracking",
      description: "No clear way to see who actually visits the gym and how often.",
      icon: UserSearch,
      image: "/problems/member-tracking.png"
    },
    {
      title: "Admin Work Overload",
      description: "Staff spend hours handling records instead of helping members.",
      icon: Clock,
      image: "/problems/admin-work-overload.png"
    },
    {
      title: "No Real Insights",
      description: "Gym owners struggle to understand attendance trends, active members, and business performance.",
      icon: BarChart3,
      image: "/problems/no-real-insights.png"
    },
  ];

  return (
    <section className="px-6 py-24 lg:px-14 relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-primary">PROBLEM</h3>
          <h2 className="text-4xl font-display font-bold tracking-tighter sm:text-7xl leading-[1.1] max-w-4xl mx-auto">
            Running a Gym <br className="hidden sm:block" />
            <span className="text-white/50">Shouldn&apos;t Be This</span> <span className="text-primary italic">Messy.</span>
          </h2>
          <p className="text-base sm:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed font-sans">
            Managing a growing gym with manual systems quickly becomes difficult. 
            Attendance logs, membership tracking, and payment monitoring often end up 
            scattered across notebooks, spreadsheets, and staff memory.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 max-w-7xl mx-auto md:min-h-[850px] auto-rows-fr">
          {/* Row 1, Col 1 & 2 - Small Cards */}
          <div className="md:col-span-1 md:row-span-1 p-10 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative">
            <ProblemContent problem={problems[0]} />
          </div>
          <div className="md:col-span-1 md:row-span-1 p-10 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative">
            <ProblemContent problem={problems[1]} />
          </div>

          {/* Row 1 & 2, Col 3 - Tall Card 1 */}
          <div className="md:col-span-1 md:row-span-2 p-12 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative">
            <ProblemContent problem={problems[2]} />
          </div>

          {/* Row 2 & 3, Col 1 - Tall Card 2 */}
          <div className="md:col-span-1 md:row-span-2 p-12 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative">
            <ProblemContent problem={problems[3]} />
          </div>

          {/* Row 2, Col 2 - Small Card */}
          <div className="md:col-span-1 md:row-span-1 p-10 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative">
            <ProblemContent problem={problems[4]} />
          </div>

          {/* Row 3, Col 2 & 3 - Solution Spanning 2 Columns */}
          <div className="md:col-span-2 md:row-span-1 relative p-12 rounded-3xl border border-primary/20 bg-black/20 backdrop-blur-xl overflow-hidden text-center shadow-glow group flex items-center justify-center">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
             <div className="space-y-6 relative z-10 w-full">
                <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tighter">
                  There&apos;s a <span className="text-primary italic">Better Way.</span>
                </h3>
                <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
                  Gymcentrix centralizes member management, automates attendance, tracks payments, and provides clear insights into member activity and gym performance.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 text-primary font-bold uppercase tracking-widest text-[10px] sm:text-2xs">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(167,243,62,0.4)]" />
                     RFID tap check-ins
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(167,243,62,0.4)]" />
                     Attendance dashboards
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(167,243,62,0.4)]" />
                     Membership & payment tracking
                   </div>
                </div>
             </div>
             {/* Abstract Decoration */}
             <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors duration-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemContent({ problem }: { problem: any }) {
  return (
    <div className="h-full flex flex-col justify-end gap-6 relative z-10">
      {problem.image && (
        <div className="absolute inset-x-[-2.5rem] inset-y-[-2.5rem] md:inset-x-[-3rem] md:inset-y-[-3rem] z-[-1]">
          <Image 
            src={problem.image} 
            alt={problem.title}
            fill
            className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
        <problem.icon className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
      </div>
      <div className="space-y-3">
        <h4 className="text-xl font-display font-bold tracking-tight">{problem.title}</h4>
        <p className="text-sm text-white/40 leading-relaxed font-sans">{problem.description}</p>
      </div>
    </div>
  );
}



function FeaturesGrid() {
  return (
    <section className="px-6 py-24 lg:px-14 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-12 sm:mb-16 text-center sm:text-left">
          <h2 className="text-3xl font-display font-bold tracking-tighter sm:text-6xl mb-6">Designed for scale.</h2>
          <p className="text-base sm:text-lg text-white/40 font-sans leading-relaxed">Everything you need to run a high-performance fitness business without the technical debt.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div key={i} className="group p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-primary/20 transition duration-500 hover:shadow-glow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition duration-500">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 tracking-tighter">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-sans">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RfidHighlight() {
  return (
    <section className="px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden border border-primary/20 bg-white/[0.02] p-8 sm:p-24 group relative backdrop-blur-sm shadow-glow text-center sm:text-left">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition duration-700 hidden sm:block">
          <Smartphone className="w-96 h-96 -rotate-12 text-primary" />
        </div>
        
        <div className="max-w-2xl relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-primary/10 flex items-center justify-center mb-6 sm:mb-10 border border-primary/20 shadow-glow mx-auto sm:mx-0">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary font-bold" />
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tighter sm:text-6xl mb-6 sm:mb-8 leading-[1.2] sm:leading-[1.1]">
            Frictionless Sign-In with <span className="text-primary italic">RFID.</span>
          </h2>
          <p className="text-base sm:text-xl text-white/40 mb-8 sm:mb-12 leading-relaxed font-sans">
            Eliminate bottlenecks at the front desk. Our RFID integration allows members to sign in with a simple tap, 
            instantaneously updating your attendance metrics.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 text-white/50 text-sm font-sans uppercase tracking-[0.2em] font-bold">
            <div className="flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Instant Validation
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Locker Sync
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              PT Tracking
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Safe Access
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-5xl text-center space-y-8 sm:space-y-12">
        <h2 className="text-4xl font-display font-bold tracking-tighter sm:text-7xl lg:text-8xl leading-tight">
          Scale your <br /><span className="text-primary italic">Ambition.</span>
        </h2>
        <p className="text-xl text-white/40 max-w-2xl mx-auto font-sans">
          Join hundreds of owners who have switched to Gymcentrix to streamline their operations.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-6">
          <PrimaryCta href={registerHref}>Start 14-day Free Trial</PrimaryCta>
          <SecondaryCta href={dashboardHref}>Request custom Demo</SecondaryCta>
        </div>
        <p className="text-xs text-white/20 uppercase tracking-[0.3em] font-bold">No credit card required</p>
      </div>
    </section>
  );
}

function PrimaryCta({ href, children }: { href: Route; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-5 text-sm font-bold text-black hover:scale-105 active:scale-95 transition shadow-glow-strong uppercase tracking-widest"
    >
      {children}
      <ArrowUpRight className="w-4 h-4 stroke-[3px]" />
    </Link>
  );
}

function SecondaryCta({ 
  href, 
  children, 
}: { 
  href: Route; 
  children: React.ReactNode; 
}) {
  return (
    <Link
      href={href}
      className="inline-flex gap-2 items-center px-8 py-5 text-sm font-bold text-white rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition uppercase tracking-widest"
    >
      {children}
    </Link>
  );
}

