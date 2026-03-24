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
        <div className="flex flex-wrap gap-4 pt-4">
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
