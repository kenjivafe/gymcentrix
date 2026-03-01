"use client";

import { useEffect, useState } from "react";
import { Fingerprint, LogIn, LogOut } from "lucide-react";

import { DisabledHint } from "@/components/ui/ui-states";
import {
  recentAttendanceEvents,
  todayAttendanceSummary,
  type AttendanceEvent,
} from "@/lib/attendance";

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {sub != null && <p className="mt-0.5 text-xs text-white/50">{sub}</p>}
    </div>
  );
}

function EventRow({ event }: { event: AttendanceEvent }) {
  const isCheckIn = event.type === "check-in";
  const Icon = isCheckIn ? LogIn : LogOut;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isCheckIn ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-white">{event.employeeName}</p>
        <p className="text-xs text-white/50">
          {event.type === "check-in" ? "Checked in" : "Checked out"}
          {event.role ? ` · ${event.role}` : ""}
        </p>
      </div>
      <span className="text-sm text-white/70">{event.time}</span>
    </div>
  );
}

export function AttendancePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const { expected, present, label } = todayAttendanceSummary;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm uppercase text-white/60">Daily attendance</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Today&apos;s attendance</h1>
          <p className="text-white/70">
            See who is checked in, review recent activity. Biometric check-in will be available when the backend is
            wired.
          </p>
        </div>
        <DisabledHint label="Record check-in disabled until biometric API ready" />
      </header>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-3">
          <SummaryCard label={`Expected (${label})`} value={expected} sub="scheduled staff" />
          <SummaryCard label="Present" value={present} sub="checked in" />
          <SummaryCard
            label="Absent"
            value={expected - present}
            sub="not yet checked in"
          />
        </section>
      )}

      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5/30 p-6 shadow-card backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <span className="text-xs uppercase tracking-wider text-white/50">
            Check-in / check-out
          </span>
        </div>
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-white/10" />
            ))
          ) : (
            recentAttendanceEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white/60"
        >
          <Fingerprint className="h-5 w-5" />
          Record check-in (biometric coming soon)
        </button>
      </div>
    </div>
  );
}
