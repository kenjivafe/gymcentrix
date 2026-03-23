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
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-14 mb-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-display font-bold tracking-tighter sm:text-6xl text-white">
            Who Gymcentrix Is For
          </h2>
          <p className="text-base sm:text-lg text-white/50 leading-relaxed font-sans">
            Gymcentrix is built to simplify gym operations, automate attendance, and help gym owners manage their business more efficiently.
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Faded Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-64 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-64 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />

        {/* Scrolling Area */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-12"
        >
          {/* Invisible Spacer to allow centering the first card */}
          <div className="shrink-0 w-[calc(50vw-150px)] sm:w-[calc(50vw-190px)] lg:w-[calc(50vw-220px)]" />
          
          <div className="flex gap-6">
            {targets.map((target, i) => (
              <div 
                key={i} 
                onClick={handleCardClick}
                className="w-[300px] sm:w-[380px] shrink-0 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 flex flex-col items-center sm:items-start text-center sm:text-left group cursor-pointer snap-center"
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

          {/* Invisible Spacer to allow centering the last card */}
          <div className="shrink-0 w-[calc(50vw-150px)] sm:w-[calc(50vw-190px)] lg:w-[calc(50vw-220px)]" />
        </div>
      </div>

      <div className="text-center mt-4 sm:hidden">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Scroll or click to explore</p>
      </div>
    </section>
  );
}
