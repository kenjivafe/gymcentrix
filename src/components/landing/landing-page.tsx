import type { Route } from "next";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Sparkles, 
  BarChart3, 
  Users, 
  CreditCard, 
  Zap, 
  ShieldCheck,
  Smartphone
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
    <div className="overflow-hidden relative text-white bg-canvas min-h-screen font-sans bg-grid">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 bg-mesh-glow pointer-events-none" aria-hidden />
      
      <main className="relative z-10">
        <Navbar />
        <HeroSection />
        <StatsSection />
        <FeaturesGrid />
        <RfidHighlight />
        <CtaSection />
      </main>

      <footer className="relative z-10 px-6 py-12 border-t border-white/5 bg-black/20 text-center">
        <p className="text-white/40 text-sm font-sans">
          © {new Date().getFullYear()} Gymcentrix. The Operating System for Modern Gyms.
        </p>
      </footer>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-8 mx-auto max-w-7xl lg:px-14">
      <Link href="/" className="flex items-center gap-4 group cursor-pointer transition-transform hover:scale-[1.02] active:scale-95">
        <img src="/app/gymcentrix-logo.png" alt="" className="h-10 w-auto" aria-hidden />
        <span className="text-2xl font-display font-bold tracking-tighter text-white group-hover:text-primary transition-colors text-glow">
          GYMCENTRIX
        </span>
      </Link>
      <div className="hidden md:flex gap-8 text-sm font-medium text-white/70 font-sans uppercase tracking-widest">
        <Link href="#" className="hover:text-primary transition">Features</Link>
        <Link href="#" className="hover:text-primary transition">Pricing</Link>
        <Link href="#" className="hover:text-primary transition">Enterprise</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href={dashboardHref} className="text-sm font-medium hover:text-primary transition font-sans uppercase tracking-widest">Sign In</Link>
        <PrimaryCta href={registerHref}>Start Free trial</PrimaryCta>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="px-6 pt-12 pb-20 lg:px-14 lg:pt-26">
      <div className="mx-auto max-w-6xl text-center space-y-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs uppercase tracking-[0.4em] text-primary font-bold">
          <Sparkles className="w-4 h-4" /> Professional Gym Management
        </div>
        <h1 className="text-5xl font-display font-bold tracking-tighter leading-[1] sm:text-8xl lg:text-9xl">
          The OS for <br />
          <span className="text-primary text-glow italic">Modern Gyms.</span>
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
          Gymcentrix empowers owners with a unified platform for billing, analytics, and member engagement. 
          Automate the boring stuff and focus on building your community.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <PrimaryCta href={registerHref}>Get Started Now</PrimaryCta>
          <SecondaryCta href={dashboardHref}>View Platform Demo</SecondaryCta>
        </div>
        
        <div className="flex items-center justify-center gap-6 pt-12 border-t border-white/5 max-w-xs mx-auto">
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
    </section>
  );
}

function StatsSection() {
  return (
    <section className="px-6 py-12 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-12 rounded-[3rem] border border-primary/20 bg-white/[0.02] backdrop-blur-3xl shadow-glow">
          {[
            { label: "Check-ins Today", value: "2.4k+" },
            { label: "Revenue Growth", value: "+32%" },
            { label: "Admin Hours Freed", value: "14h/wk" },
            { label: "Client Retention", value: "94%" },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/30 font-bold font-sans">{stat.label}</p>
              <p className="text-4xl font-display font-bold text-white tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  return (
    <section className="px-6 py-24 lg:px-14 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl font-display font-bold tracking-tighter sm:text-6xl mb-6">Designed for scale.</h2>
          <p className="text-lg text-white/40 font-sans leading-relaxed">Everything you need to run a high-performance fitness business without the technical debt.</p>
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
      <div className="mx-auto max-w-7xl rounded-[4rem] overflow-hidden border border-primary/20 bg-white/[0.02] p-12 lg:p-24 group relative backdrop-blur-sm shadow-glow">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition duration-700">
          <Smartphone className="w-96 h-96 -rotate-12 text-primary" />
        </div>
        
        <div className="max-w-2xl relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-10 border border-primary/20 shadow-glow">
            <ShieldCheck className="w-8 h-8 text-primary font-bold" />
          </div>
          <h2 className="text-4xl font-display font-bold tracking-tighter sm:text-6xl mb-8 leading-[1.1]">
            Frictionless Sign-In with <span className="text-primary italic">RFID.</span>
          </h2>
          <p className="text-xl text-white/40 mb-12 leading-relaxed font-sans">
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
      <div className="mx-auto max-w-5xl text-center space-y-12">
        <h2 className="text-5xl font-display font-bold tracking-tighter sm:text-7xl lg:text-8xl">
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

