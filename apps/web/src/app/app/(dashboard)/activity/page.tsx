import { Activity, Construction } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow-sm">
        <Activity className="w-10 h-10 text-primary animate-pulse" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight italic">Analytics & Activity</h2>
        <p className="text-sm text-white/40 max-w-sm font-medium">
          The real-time synchronization engine is being optimized. 
          Advanced activity heatmaps and branch performance metrics will be available in the next deployment update.
        </p>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
        <Construction className="w-4 h-4 text-white/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">In Development</span>
      </div>
    </div>
  );
}
