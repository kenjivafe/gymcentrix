"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { Kpi } from "@/lib/mock-data";
import { kpis } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/ui/ui-states";

export function KpiGrid() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState label="Synchronizing Metrics..." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`kpi-skeleton-${index}`}
              className="h-32 rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-glow animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi: Kpi) => (
        <article
          key={kpi.label}
          className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 shadow-glow hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 group"
        >
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] font-sans transition-colors group-hover:text-primary/60">{kpi.label}</p>
          <p className="mt-4 text-4xl font-display font-bold tracking-tighter text-white">
            {kpi.value}
          </p>
          <div
            className={cn(
              "mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest",
              kpi.trend === "up" ? "text-primary transition-all group-hover:text-glow" : "text-rose-500"
            )}
          >
            {kpi.trend === "up" ? (
              <ArrowUpRight className="h-4 w-4 stroke-[3px]" />
            ) : (
              <ArrowDownRight className="h-4 w-4 stroke-[3px]" />
            )}
            <span>{kpi.delta}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
