import type { Route } from "next";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { AnalyticsSection } from "@/components/dashboard/analytics-section";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

export const metadata = {
  title: "Dashboard Preview | Gymcentrix",
  description: "Mock dashboard experience for internal stakeholders and UI review.",
};

export default function DashboardPage() {
  const registerPath = "/register" as Route;
  const membersPath = "/dashboard/members" as Route;
  const employeesPath = "/dashboard/employees" as Route;
  const lockersPath = "/dashboard/lockers" as Route;
  const accountingPath = "/dashboard/accounting" as Route;
  return (
    <AppShell>
      <header className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/20 font-bold font-sans">Strategic Operations</p>
          <h1 className="text-5xl font-display font-bold tracking-tighter text-white mt-2 sm:text-7xl">
            Operations <br /><span className="text-primary italic">Intelligence.</span>
          </h1>
        </div>
        <p className="text-xl text-white/40 max-w-3xl font-sans leading-relaxed">
          All content below is driven by deterministic mock data. Interactions are limited to
          client-side previews while backend integrations are under construction.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            href={registerPath}
            className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-glow-strong uppercase tracking-widest"
          >
            Launch Public Registration
            <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <Link
            href={membersPath}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-xs font-bold text-white/40 transition hover:bg-white/10 hover:text-white uppercase tracking-[0.2em] font-sans"
          >
            Members Directory
          </Link>
          <Link
            href={employeesPath}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-xs font-bold text-white/40 transition hover:bg-white/10 hover:text-white uppercase tracking-[0.2em] font-sans"
          >
            Employees
          </Link>
          <Link
            href={lockersPath}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-xs font-bold text-white/40 transition hover:bg-white/10 hover:text-white uppercase tracking-[0.2em] font-sans"
          >
            Locker Occupancy
          </Link>
          <Link
            href={accountingPath}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-xs font-bold text-white/40 transition hover:bg-white/10 hover:text-white uppercase tracking-[0.2em] font-sans"
          >
            Accounting
          </Link>
        </div>
      </header>

      <section className="space-y-6">
        <KpiGrid />
      </section>

      <AnalyticsSection />

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <ActivityTimeline />
      </section>
    </AppShell>
  );
}
