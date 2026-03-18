"use client";

import { Activity, ArrowDownRight, ArrowUpRight, Minus, PieChart } from "lucide-react";

import {
  analyticsBreakdowns,
  analyticsSeries,
  formatPercent,
  normalizeSeries,
  summarizeSeries,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function AnalyticsSection() {
  return (
    <section className="space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/20 font-bold font-sans">Strategic Intelligence</p>
          <h2 className="text-4xl font-display font-bold tracking-tighter text-white mt-1">
            Performance <span className="text-primary italic">Trends</span>
          </h2>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-primary font-bold shadow-glow transition-all hover:bg-primary/10 cursor-default">
          Live Preview
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {analyticsSeries.map((series) => (
          <TrendCard key={series.label} label={series.label} values={series.values} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 pt-4">
        {analyticsBreakdowns.map((breakdown) => (
          <BreakdownCard key={breakdown.title} title={breakdown.title} items={breakdown.items} />
        ))}
      </div>
    </section>
  );
}

function TrendCard({ label, values }: { label: string; values: number[] }) {
  const summary = summarizeSeries(values);
  const normalized = normalizeSeries(values);

  return (
    <article className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 shadow-glow hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-500 group">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] font-sans group-hover:text-primary/60 transition-colors">{label}</p>
          <p className="mt-4 text-4xl font-display font-bold tracking-tighter text-white">{summary.current.toLocaleString()}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-glow">
          <Activity className="h-6 w-6 font-bold" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-7 gap-1.5 h-12 items-end" aria-hidden>
        {normalized.map((value, index) => (
          <div
            key={`${label}-bar-${index}`}
            className="w-full rounded-t-lg bg-primary/20 group-hover:bg-primary transition-all duration-700"
            style={{ height: `${Math.max(8, value * 100)}%` }}
          />
        ))}
      </div>

      <div
        className={cn(
          "mt-8 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase",
          summary.direction === "up"
            ? "text-primary"
            : summary.direction === "down"
              ? "text-rose-500"
              : "text-white/30"
        )}
      >
        {summary.direction === "up" ? (
          <ArrowUpRight className="h-4 w-4 stroke-[3px]" />
        ) : summary.direction === "down" ? (
          <ArrowDownRight className="h-4 w-4 stroke-[3px]" />
        ) : (
          <Minus className="h-4 w-4 stroke-[3px]" />
        )}
        <span>{formatPercent(summary.deltaPercent)} vs yesterday</span>
      </div>
    </article>
  );
}

function BreakdownCard({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <article className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 shadow-glow hover:bg-white/[0.05] transition-all duration-500 group">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] font-sans group-hover:text-primary/60 transition-colors">{title}</p>
          <p className="mt-4 text-4xl font-display font-bold tracking-tighter text-white">{total.toLocaleString()}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-glow">
          <PieChart className="h-6 w-6 font-bold" />
        </div>
      </div>

      <ul className="space-y-6 text-sm font-sans">
        {items.map((item) => {
          const ratio = total === 0 ? 0 : item.value / total;
          return (
            <li key={item.label} className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white font-bold uppercase tracking-widest text-[10px]">{item.label}</span>
                <span className="text-primary font-display font-bold">{Math.round(ratio * 100)}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary shadow-glow transition-all duration-1000 origin-left" 
                  style={{ width: `${ratio * 100}%` }} 
                />
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
