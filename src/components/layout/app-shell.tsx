"use client";

import type { Route } from "next";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  BadgeCheck,
  Calculator,
  CreditCard,
  GaugeCircle,
  KeyRound,
  LayoutDashboard,
  Palette,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

import { useBrand } from "@/components/brand/brand-context";
import { useFeatureFlags } from "@/components/settings/feature-flags-context";

type FeatureKey = "lockers" | "employees" | "attendance" | "cardDesigner";

type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href?: Route;
  featureKey?: FeatureKey;
};

const dashboardRoute = "/dashboard" as Route;
const membersRoute = "/dashboard/members" as Route;
const employeesRoute = "/dashboard/employees" as Route;
const lockersRoute = "/dashboard/lockers" as Route;
const accountingRoute = "/dashboard/accounting" as Route;
const cardDesignerRoute = "/dashboard/card-designer" as Route;
const brandStudioRoute = "/dashboard/brand-studio" as Route;
const attendanceRoute = "/dashboard/attendance" as Route;
const settingsRoute = "/dashboard/settings" as Route;

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: dashboardRoute },
  { label: "Members", icon: Users, href: membersRoute },
  { label: "Employees", icon: UserCog, href: employeesRoute, featureKey: "employees" },
  { label: "Lockers", icon: KeyRound, href: lockersRoute, featureKey: "lockers" },
  { label: "Accounting", icon: Calculator, href: accountingRoute },
  { label: "Card Designer", icon: CreditCard, href: cardDesignerRoute, featureKey: "cardDesigner" },
  { label: "Attendance", icon: GaugeCircle, href: attendanceRoute, featureKey: "attendance" },
  { label: "Brand Studio", icon: Palette, href: brandStudioRoute },
  { label: "Settings", icon: Settings, href: settingsRoute },
];

export function AppShell({
  children,
  activeHref = dashboardRoute,
}: {
  children: ReactNode;
  activeHref?: Route;
}) {
  const { flags } = useFeatureFlags();
  const { brand } = useBrand();
  const visibleNavItems = navItems.filter(
    (item) => !item.featureKey || flags[item.featureKey]
  );

  return (
    <div className="min-h-screen text-white bg-canvas">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="px-6 py-8 border-r bg-canvas-subtle border-border-subtle/40">
          <Link
            href={dashboardRoute}
            className="flex flex-col gap-3 text-left"
          >
            {/* System name: Gymcentrix logo at top */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/app/gymcentrix-logo.png"
              alt="Gymcentrix"
              className="h-8 w-auto max-w-full object-contain object-left"
            />
            {/* Gym logo + gym name below */}
            <div className="flex items-center gap-3">
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logoUrl}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-lg object-contain"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const fallback = el.nextElementSibling;
                    if (fallback) (fallback as HTMLElement).style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                style={{
                  backgroundColor: brand.primaryColor,
                  display: brand.logoUrl ? "none" : "flex",
                }}
              >
                <BadgeCheck className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-white/90">
                {brand.gymName}
              </span>
            </div>
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.4em] text-white/40">Ops preview</p>
          <nav className="mt-8 space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href && item.href === activeHref;
              const baseClasses =
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition";

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`${baseClasses} ${
                      isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  className={`${baseClasses} text-white/40 opacity-60 cursor-not-allowed`}
                  type="button"
                  disabled
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-4 mt-10 text-sm bg-gradient-to-br rounded-2xl from-primary/20 to-accent/20 text-white/80">
            <p className="font-semibold text-white">UI Preview Build</p>
            <p className="mt-1 text-xs">
              Interactions are limited to mock flows until services are wired.
            </p>
          </div>
        </aside>
        <main className="overflow-hidden relative bg-canvas">
          <div className="absolute inset-0 opacity-80 bg-mesh-glow" aria-hidden />
          <div className="flex relative z-10 flex-col gap-8 p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
