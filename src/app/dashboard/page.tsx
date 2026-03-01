import type { Route } from "next";
import Link from "next/link";

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
      <header className="space-y-2">
        <p className="text-sm uppercase text-white/60">Gymcentrix dashboard preview</p>
        <h1 className="text-4xl font-semibold tracking-tight">Operations at a glance</h1>
        <p className="text-lg text-white/70">
          All content below is driven by deterministic mock data. Interactions are limited to
          client-side previews while backend integrations are under construction.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={registerPath}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Launch public registration preview
          </Link>
          <Link
            href={membersPath}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/15"
          >
            View members directory
          </Link>
          <Link
            href={employeesPath}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/15"
          >
            Monitor employees attendance
          </Link>
          <Link
            href={lockersPath}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/15"
          >
            Track locker occupancy
          </Link>
          <Link
            href={accountingPath}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/15"
          >
            Review accounting
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
