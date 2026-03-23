import React from 'react';
import Image from 'next/image';

const targets = [
  {
    title: "Independent Gyms",
    description: "Manage memberships, attendance, and payments from one simple system.",
    image: "/who-is-it-for/independent.png",
  },
  {
    title: "Growing Gym Chains",
    description: "Centralize member data and monitor multiple gym locations from a single dashboard.",
    image: "/who-is-it-for/growing.png",
  },
  {
    title: "New Gym Owners",
    description: "Start your gym with modern tools for managing members and tracking attendance.",
    image: "/who-is-it-for/new.png",
  },
];

export function WhoIsItFor() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  // 50 sets of 4 items = 200 items total for a truly "infinite" feel
  const loopedTargets = React.useMemo(() => Array(50).fill(targets).flat(), []);

  // Initialize scroll position to the absolute middle on mount
  React.useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      setTimeout(() => {
        const scrollWidth = container.scrollWidth;
        container.scrollTo({ 
          left: scrollWidth / 2 - container.clientWidth / 2, 
          behavior: 'instant' 
        });
      }, 0);
    }
  }, []);

  // Seamless looping teleportation
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Jump if we're in the first 20% or last 20%
    if (scrollLeft < scrollWidth / 5) {
      container.scrollTo({ left: scrollLeft + scrollWidth / 2, behavior: 'instant' });
    } else if (scrollLeft > (scrollWidth * 4) / 5 - clientWidth) {
      container.scrollTo({ left: scrollLeft - scrollWidth / 2, behavior: 'instant' });
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  return (
    <section className="pt-24 pb-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-14 mb-2 sm:mb-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h2 className="text-lg sm:text-6xl font-display font-bold tracking-tighter text-white">
            Who <span className="uppercase text-primary">Gymcentrix</span> Is For
          </h2>
          <p className="text-base sm:text-lg text-white/50 leading-relaxed font-sans">
            Gymcentrix is built to simplify gym operations, automate attendance, and help gym owners manage their business more efficiently.
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Faded Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-80 bg-gradient-to-r from-canvas via-canvas/90 to-transparent z-10 pointer-events-none hidden sm:block" />
        <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-80 bg-gradient-to-l from-canvas via-canvas/90 to-transparent z-10 pointer-events-none hidden sm:block" />

        {/* Scrolling Area - scroll-smooth removed from here and used in scrollIntoView for clicks */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pt-10 sm:pt-20 pb-20"
        >
          <div className="flex gap-4 sm:gap-8 px-[10vw]">
            {loopedTargets.map((target, i) => (
              <div 
                key={i} 
                onClick={handleCardClick}
                className="w-[320px] sm:w-[600px] aspect-[3/4] sm:aspect-[4/3] shrink-0 p-10 sm:p-14 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:border-primary/20 hover:shadow-glow-strong hover:scale-[1.02] active:scale-[0.98] transition-all duration-700 flex flex-col justify-end items-center sm:items-start text-center sm:text-left group cursor-pointer snap-center relative overflow-hidden"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={target.image} 
                    alt={target.title} 
                    fill 
                    className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-[1.5s] ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-1000" />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <h3 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {target.title}
                  </h3>
                  <p className="text-sm sm:text-lg text-white/50 leading-relaxed font-sans max-w-sm">
                    {target.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-[10px] sm:text-xs text-white/20 uppercase tracking-[0.4em] font-bold animate-pulse">Swipe or click to explore</p>
      </div>
    </section>
  );
}
