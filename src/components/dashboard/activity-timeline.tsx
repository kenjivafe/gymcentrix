import { timeline } from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/ui-states";

export function ActivityTimeline() {
  if (!timeline.length) {
    return (
      <EmptyState
        title="No recent activity"
        description="Timeline entries will appear once backend events are connected."
      />
    );
  }

  return (
    <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 shadow-glow hover:bg-white/[0.04] transition-all duration-500 group">
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <h3 className="text-xl font-display font-bold tracking-tighter text-white">Recent <span className="text-primary italic">Activity</span></h3>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Historical Stack</span>
      </div>
      <ol className="mt-8 space-y-8">
        {timeline.map((entry) => (
          <li key={entry.id} className="relative pl-10 group/item">
            <span className="absolute left-0 top-1.5 block h-3 w-3 rounded-full bg-primary shadow-glow transition-transform group-hover/item:scale-125" aria-hidden />
            <div className="absolute left-[5.5px] top-6 bottom-[-32px] w-[1px] bg-white/5 group-last:hidden" />
            
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">{entry.timestamp}</div>
            <p className="text-lg font-display font-bold tracking-tight text-white group-hover/item:text-primary transition-colors">{entry.title}</p>
            <p className="mt-1 text-sm text-white/40 font-sans leading-relaxed">{entry.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
