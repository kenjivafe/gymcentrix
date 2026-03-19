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
    <div className="relative min-h-screen text-white bg-canvas font-sans">
      <div className="absolute inset-0 z-0 opacity-20 bg-mesh-glow pointer-events-none" aria-hidden />
      
      {/* Mobile: header */}
      <header
        className={`fixed top-0 left-0 right-0 ${sidebarOpen ? "z-30" : "z-50"} lg:hidden border-b border-white/5 px-4 py-4 backdrop-blur-xl bg-black/20`}
      >
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl transition text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
            <Image 
              src="/app/gymcentrix-logo.png" 
              alt="" 
              width={80} 
              height={20} 
              className="h-5 w-auto logo-glow" 
              aria-hidden
            />
            <span className="text-lg font-display font-bold tracking-tighter text-white text-glow">
              Gymcentrix
            </span>
          </Link>
          <div className="w-10" aria-hidden />
        </div>
      </header>

      {/* Mobile: backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm transition-all"
          aria-hidden
          tabIndex={-1}
        />
      )}

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr] relative pt-16 lg:pt-0">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-white/5 bg-canvas px-8 py-10 transition-transform duration-500 lg:static lg:z-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-10">
            <Link
              href={dashboardRoute}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 mb-8 group">
                <Image 
                  src="/app/gymcentrix-logo.png" 
                  alt="Gymcentrix" 
                  width={128} 
                  height={32} 
                  className="h-8 w-auto logo-glow" 
                />
                <span className="text-xl font-display font-bold tracking-tighter text-white group-hover:text-primary transition-colors text-glow">
                  Gymcentrix
                </span>
              </div>
              
              <div className="flex gap-4 items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 shadow-glow">
                <div
                  className="flex justify-center items-center size-10 text-black rounded-xl shrink-0 bg-primary shadow-glow-strong"
                >
                  <BadgeCheck className="size-5 font-bold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/30">Active Gym</span>
                  <span className="text-sm font-display font-bold tracking-tight text-white leading-tight">
                    {brand.gymName}
                  </span>
                </div>
              </div>
            </Link>

            <nav className="space-y-1">
              <p className="px-4 mb-4 text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Main Navigation</p>
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href && item.href === activeHref;
                const baseClasses =
                  "flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition-all uppercase tracking-widest";

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`${baseClasses} ${
                        isActive 
                          ? "text-primary bg-primary/10 border border-primary/20 shadow-glow" 
                          : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <Icon className={`size-4 ${isActive ? "text-primary" : ""}`} />
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.label}
                    className={`${baseClasses} opacity-30 cursor-not-allowed text-white/40`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </div>
                );
              })}
            </nav>

            <div className="p-6 mt-6 rounded-3xl bg-primary shadow-glow-strong text-black space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition duration-500">
                <GaugeCircle className="size-16" />
              </div>
              <p className="font-display font-bold text-lg tracking-tighter leading-tight relative z-10">UI Preview Build</p>
              <p className="text-xs font-bold leading-relaxed opacity-70 relative z-10 font-sans">
                Interactions are limited to mock flows until backend services are finalized.
              </p>
            </div>
          </div>
        </aside>

        <main className="overflow-hidden overflow-x-hidden relative bg-grid">
          <div className="flex relative z-10 flex-col gap-10 p-8 lg:p-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
