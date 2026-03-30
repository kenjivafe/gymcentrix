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

  const getZIndex = (index: number) => {
    const activeIndex = hoveredIndex !== null ? hoveredIndex : 0;
    // Symmetrical mountain: Active card is the peak (100)
    // Cards before decrease from peak to bottom (Index 0 is the most "underneath" of the 'before' set)
    // Cards after decrease from peak to bottom (Last index is the most "underneath" of the 'after' set)
    return 100 - Math.abs(index - activeIndex);
  };

  return (
    <div className="flex flex-col -space-y-[150px] pb-24 pt-4 group/stack" 
         onMouseLeave={() => setHoveredIndex(null)}>
      {initialAttendance.length === 0 ? (
        <p className="text-xs text-white/20 italic">No tap events recorded today.</p>
      ) : (
        initialAttendance.map((log, index) => {
          // Top card is active by default; otherwise follow hoveredIndex
          const isActive = hoveredIndex === null ? index === 0 : hoveredIndex === index;
          const isBefore = hoveredIndex !== null && index < hoveredIndex;
          const isAfter = hoveredIndex !== null && index > hoveredIndex;
          
          return (
            <div 
              key={log.id} 
              style={{ zIndex: getZIndex(index) }}
              onMouseEnter={() => setHoveredIndex(index)}
              className={`relative bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] transition-all duration-500 shadow-2xl group/card overflow-hidden h-[220px] w-full cursor-pointer
              ${isActive
                ? '-rotate-1 ring-1 ring-primary/20' 
                : 'rotate-0 ring-0 hover:-rotate-1'}`}
            >
              {/* TOP SECTION (Detailed status - slides in OR Identity for 'before' cards) */}
              <div className={`absolute top-8 left-8 right-8 flex flex-col gap-6 transition-all duration-500 delay-75 text-left
                ${(isActive || isBefore) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                 
                 {/* Show identity if it's a 'before' peek, else show auth details */}
                 {isBefore && !isActive ? (
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                         <UserCheck className="w-5 h-5 text-white/40" />
                      </div>
                      <div className="min-w-0">
                         <p className="font-display font-bold text-white text-base truncate">{log.member.name}</p>
                         <p className="text-[9px] text-white/20 uppercase tracking-widest font-black truncate">{log.branch.name}</p>
                      </div>
                   </div>
                 ) : (
                   <>
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
                        <span className={`text-4xl font-display font-black transition-colors uppercase tracking-tighter
                           ${isActive ? 'text-white/40' : 'text-white/10'}`}>
                           {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                     </div>
                   </>
                 )}
              </div>

               {/* BOTTOM SECTION (Visible for 'after' cards and 'active' card) */}
              <div className={`absolute bottom-6 left-8 right-8 flex items-center gap-5 transition-all duration-500
                 ${isBefore && !isActive ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 shadow-inner
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
