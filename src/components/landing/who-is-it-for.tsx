import React from 'react';
import { 
  Dumbbell, 
  Users, 
  Layers, 
  Sparkles 
} from 'lucide-react';

const targets = [
  {
    title: "Independent Gyms",
    description: "Manage memberships, attendance, and payments from one simple system.",
    icon: Dumbbell,
  },
  {
    title: "Fitness Studios",
    description: "Track member visits and manage class attendance with ease.",
    icon: Sparkles,
  },
  {
    title: "Growing Gym Chains",
    description: "Centralize member data and monitor multiple gym locations from a single dashboard.",
    icon: Layers,
  },
  {
    title: "New Gym Owners",
    description: "Start your gym with modern tools for managing members and tracking attendance.",
    icon: Users,
  },
];

export function WhoIsItFor() {
  // Duplicate targets to ensure seamless looping
  const duplicatedTargets = [...targets, ...targets, ...targets, ...targets];

  return (
    <section className="px-6 py-24 lg:px-14 relative overflow-hidden group/section">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-display font-bold tracking-tighter sm:text-6xl text-white">
            Who Gymcentrix Is For
          </h2>
          <p className="text-base sm:text-lg text-white/50 leading-relaxed font-sans">
            Gymcentrix is built to simplify gym operations, automate attendance, and help gym owners manage their business more efficiently.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Faded Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />

        {/* Scrolling Area */}
        <div className="flex overflow-hidden">
          <div className="flex gap-6 py-4 animate-marquee group-hover/section:[animation-play-state:paused]">
            {duplicatedTargets.map((target, i) => (
              <div 
                key={i} 
                className="w-[300px] sm:w-[380px] shrink-0 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 flex flex-col items-center sm:items-start text-center sm:text-left group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                  <target.icon className="w-7 h-7 text-white/40 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">
                  {target.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-sans line-clamp-2">
                  {target.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
