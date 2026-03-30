"use client";

import { useState } from "react";
import { UserCheck } from "lucide-react";

interface TapEvent {
  id: string;
  timestamp: Date | string;
  member: { name: string };
  branch: { name: string };
}

export function RecentTapEvents({ initialAttendance }: { initialAttendance: TapEvent[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastHoveredIndex, setLastHoveredIndex] = useState<number>(0);

  const getZIndex = (index: number) => {
    const activeIndex = hoveredIndex !== null ? hoveredIndex : 0;
    // Symmetrical mountain: Active card is the peak (100)
    return 100 - Math.abs(index - activeIndex);
  };

  return (
    <div className="flex flex-col pb-8 pt-4 group/stack" 
         onMouseLeave={() => setHoveredIndex(null)}>
      {initialAttendance.length === 0 ? (
        <p className="text-xs text-white/20 italic">No tap events recorded today.</p>
      ) : (
        initialAttendance.map((log, index) => {
          // Top card is active by default; otherwise follow hoveredIndex
          const isActive = hoveredIndex === null ? index === 0 : hoveredIndex === index;
          const isBefore = (hoveredIndex !== null ? index < hoveredIndex : false);
          
          // Calculate staggering delay for "unhovering" return animation
           const delayMs = hoveredIndex === null && index <= lastHoveredIndex 
            ? (lastHoveredIndex - index) * 60 
            : 0;
          const returnDelay = `${delayMs}ms`;
          
          return (
            <div 
              key={log.id} 
              style={{ 
                zIndex: getZIndex(index),
                transitionDelay: returnDelay 
              }}
              onMouseEnter={() => {
                setHoveredIndex(index);
                setLastHoveredIndex(index);
              }}
              className={`relative bg-[#0A0A0A] border border-white/10 rounded-3xl transition-all duration-500 shadow-2xl group/card overflow-hidden aspect-[8/5] w-full cursor-pointer
              ${index !== initialAttendance.length - 1 ? '-mb-[44%]' : ''}
              ${isActive
                ? '-translate-y-4 -rotate-1 scale-[1.01] ring-1 ring-primary/20' 
                : 'translate-y-0 rotate-0 scale-100 ring-0 hover:-translate-y-2 hover:-rotate-1'}`}
            >
              {/* TOP SECTION (Detailed status - slides in OR Identity for 'before' cards) */}
              <div className="absolute top-[15%] left-[8%] right-[8%]">
                 {/* Member Identity (Top Peek Version) */}
                 <div className={`absolute top-0 left-0 right-0 flex items-start gap-4 transition-all duration-300
                    ${(isBefore && !isActive) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                    style={{ transitionDelay: `${delayMs + (isActive ? 0 : 75)}ms` }}>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                       <UserCheck className="w-5 h-5 text-white/40" />
                    </div>
                    <div className="min-w-0">
                       <p className="font-display font-bold text-white text-base truncate">{log.member.name}</p>
                       <p className="text-[9px] text-white/20 uppercase tracking-widest font-black truncate">{log.branch.name}</p>
                    </div>
                 </div>

                 {/* Auth Details (Expanded Version) */}
                 <div className={`absolute top-0 left-0 right-0 flex flex-col gap-6 transition-all duration-300
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                    style={{ transitionDelay: `${delayMs + (isActive ? 75 : 0)}ms` }}>
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <p className="text-[10px] text-primary uppercase tracking-[0.3em] font-black">Authorized</p>
                         <p className="text-sm font-bold text-white/40">Biometric Verification</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest leading-none transition-colors
                         ${isActive ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-white/20'}`}>
                         RFID Node 01
                      </div>
                   </div>
                   
                   <div className="pt-4 border-t border-white/5">
                      <span className={`text-2xl font-display font-black transition-colors uppercase tracking-tighter
                         ${isActive ? 'text-white/40' : 'text-white/10'}`}>
                         {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                   </div>
                 </div>
              </div>

               {/* BOTTOM SECTION (Visible for 'after' cards and 'active' card) */}
              <div className={`absolute bottom-[10%] left-[8%] right-[8%] flex items-center gap-5 transition-all duration-500
                 ${isBefore && !isActive ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                 style={{ transitionDelay: returnDelay }}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 shadow-inner
                   ${isActive ? 'bg-primary/20 border-primary/20' : 'bg-white/5 border-white/5'}`}>
                   <UserCheck className={`w-6 h-6 transition-all ${isActive ? 'text-primary' : 'text-white/40'}`} />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="font-display font-bold tracking-tight text-white text-lg transition-all truncate">{log.member.name}</p>
                   <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black truncate">{log.branch.name}</p>
                   </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
