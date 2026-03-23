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
  return (
    <section className="px-6 py-24 lg:px-14 relative overflow-hidden">
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

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {targets.map((target, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 flex flex-col items-center sm:items-start text-center sm:text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                <target.icon className="w-7 h-7 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">
                {target.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed font-sans">
                {target.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
