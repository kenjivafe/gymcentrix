"use client";

import type { Route } from "next";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ShieldAlert,
  Building2,
  Users,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/super-admin" as Route },
  { label: "Gyms", icon: Building2, href: "/super-admin/gyms" as Route },
  { label: "Owners", icon: Users, href: "/super-admin/owners" as Route },
];

export function SuperAdminShell({
  children,
  activeHref = "/super-admin" as Route,
  userName,
}: {
  children: ReactNode;
  activeHref?: Route;
  userName?: string | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSidebar]);

  return (
    <div className="relative min-h-screen text-white bg-canvas overflow-x-hidden">
      {/* Mesh Glow Background */}
      <div className="absolute inset-0 z-0 opacity-80 bg-mesh-glow" aria-hidden />

      {/* Mobile Header */}
      <header
        className={`fixed top-0 left-0 right-0 ${sidebarOpen ? "z-30" : "z-50"} lg:hidden border-b border-white/10 px-4 py-3 backdrop-blur bg-transparent flex justify-between items-center`}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg transition text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="font-bold tracking-tight">Gymcentrix Admin</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Mobile: backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-hidden
        />
      )}

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr] relative pt-14 lg:pt-0">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-white/10 bg-canvas-subtle/95 px-6 py-8 backdrop-blur lg:bg-canvas-subtle lg:backdrop-blur-none lg:static lg:z-auto lg:translate-x-0 lg:transform-none transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-start mb-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <ShieldAlert className="w-8 h-8" />
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Gymcentrix <span className="text-white/50">Admin</span>
                </h1>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/40 ml-1">
                Developer portal
              </p>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === activeHref;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-10">
             <div className="p-4 bg-white/5 border border-white/5 rounded-2xl mb-6">
                <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-2">Authenticated as</p>
                <p className="text-sm font-medium text-white truncate">{userName || "Super Admin"}</p>
                <p className="text-[10px] text-primary/80 font-mono mt-0.5">ROLE: SUPER_ADMIN</p>
             </div>
             <button 
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 hover:bg-rose-500/10 hover:text-rose-400 transition"
             >
                <LogOut className="w-4 h-4" />
                Sign Out
             </button>
          </div>
        </aside>

        <main className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
