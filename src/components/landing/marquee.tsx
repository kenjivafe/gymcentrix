import React from "react";

export function Marquee() {
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
