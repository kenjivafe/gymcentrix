"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  BadgeCheck,
  Calculator,
  CreditCard,
  GaugeCircle,
  KeyRound,
  LayoutDashboard,
  Menu,
  Palette,
  Settings,
  UserCog,
  Users,
  X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { flags } = useFeatureFlags();
  const { brand } = useBrand();
  const visibleNavItems = navItems.filter(
    (item) => !item.featureKey || flags[item.featureKey]
  );

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSidebar]);

  return (
    <div className="relative min-h-screen text-white bg-canvas">
      <div className="absolute inset-0 z-0 opacity-80 bg-mesh-glow" aria-hidden />
      {/* Mobile: hamburger button in header */}
      <header
        className={`fixed top-0 left-0 right-0 ${sidebarOpen ? "z-30" : "z-50"} lg:hidden border-b border-white/10 px-4 py-3 backdrop-blur bg-transparent`}
      >
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Image
            src="/app/gymcentrix-logo.png"
            alt="Gymcentrix"
            width={160}
            height={32}
            className="object-contain w-auto h-8"
            priority
          />
          <div className="w-10" aria-hidden />
        </div>
      </header>

      {/* Mobile: backdrop when sidebar open */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-hidden
          tabIndex={-1}
        />
      )}

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr] relative pt-14 lg:pt-0">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-white/10 bg-canvas-subtle/95 px-6 py-8 backdrop-blur lg:bg-canvas-subtle lg:backdrop-blur-none lg:static lg:z-auto lg:translate-x-0 lg:transform-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex gap-4 justify-between items-start">
            <Link
              href={dashboardRoute}
              className="flex flex-col gap-3 text-left"
            >
              {/* System name: Gymcentrix logo at top */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/app/gymcentrix-logo.png"
                alt="Gymcentrix"
                className="object-contain object-left w-auto max-w-full h-8"
              />
              {/* Gym logo + gym name below */}
              <div className="flex gap-3 items-center">
                {brand.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoUrl}
                    alt=""
                    className="object-contain w-9 h-9 rounded-lg shrink-0"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                      const fallback = el.nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="flex justify-center items-center w-9 h-9 text-white rounded-lg shrink-0"
                  style={{
                    backgroundColor: brand.primaryColor,
                    display: brand.logoUrl ? "none" : "flex",
                  }}
                >
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-white/90">
                  {brand.gymName}
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={closeSidebar}
              className="p-2 mt-0 rounded-lg transition text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
                    onClick={closeSidebar}
                    className={`${baseClasses} ${
                      isActive ? "text-white bg-white/10" : "text-white/70 hover:bg-white/5"
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
                  className={`opacity-60 cursor-not-allowed ${baseClasses} text-white/40`}
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
        <main className="overflow-hidden overflow-x-hidden relative">
          <div className="flex relative z-10 flex-col gap-8 p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
