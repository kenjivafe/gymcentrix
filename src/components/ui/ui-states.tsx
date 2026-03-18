type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading Strategic Data..." }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary/60 shadow-glow">
      <span className="h-2 w-2 animate-ping rounded-full bg-primary shadow-glow" aria-hidden />
      {label}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.01] p-12 text-center">
      <p className="text-xl font-display font-bold tracking-tighter text-white underline decoration-primary/20 underline-offset-8 decoration-2">{title}</p>
      <p className="mt-4 text-sm text-white/30 font-sans leading-relaxed max-w-xs mx-auto">{description}</p>
    </div>
  );
}

type DisabledHintProps = {
  label: string;
};

export function DisabledHint({ label }: DisabledHintProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
      <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden className="text-primary/40">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 2.8V5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="5" cy="7" r="0.6" fill="currentColor" />
      </svg>
      {label}
    </div>
  );
}
