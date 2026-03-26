"use client";

import { Monitor, ExternalLink, ShieldCheck, Zap } from "lucide-react";

export default function KioskControlPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Kiosk Management</h2>
          <p className="text-sm text-white/40 font-medium">Deploy and manage interactive check-in terminals for your facility.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Monitor className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-glow-sm">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-white tracking-tight">Launch Check-in Terminal</h3>
                <p className="text-sm text-white/40 max-w-md leading-relaxed font-medium">
                  Initialize a member-facing kiosk on this device. We recommend moving the launched window to a dedicated secondary monitor at your facility entrance.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => window.open('/app/kiosk/display', '_blank', 'noopener,noreferrer')}
                  className="px-8 py-4 rounded-2xl bg-primary text-black font-bold text-sm hover:shadow-glow transition-all active:scale-95 flex items-center gap-3"
                >
                  <ExternalLink className="w-5 h-5" />
                  Launch Kiosk Screen
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                   <ShieldCheck className="w-5 h-5 text-white/40" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Secure Access</p>
                   <p className="text-[10px] text-white/20 font-medium leading-relaxed">The kiosk requires active staff authentication and is scoped to your specific gym facility.</p>
                </div>
             </div>
             <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                   <Monitor className="w-5 h-5 text-white/40" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Hardware Sync</p>
                   <p className="text-[10px] text-white/20 font-medium leading-relaxed">Compatible with standard USB RFID scanners acting as keyboard input devices.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <h6 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Setup Instructions</h6>
              <div className="space-y-6">
                 {[
                   { step: "01", text: "Ensure a high-performance RFID scanner is connected via USB." },
                   { step: "02", text: "Launch the terminal using the primary button." },
                   { step: "03", text: "Drag the new window to your member-facing monitor." },
                   { step: "04", text: "Press F11 to enter dedicated fullscreen mode." },
                 ].map((item) => (
                   <div key={item.step} className="flex gap-4">
                      <span className="text-xs font-black text-primary/40 pt-0.5">{item.step}</span>
                      <p className="text-xs text-white/60 font-medium leading-relaxed">{item.text}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
