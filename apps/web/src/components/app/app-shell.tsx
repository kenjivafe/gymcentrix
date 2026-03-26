"use client";

import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Cpu,
  Settings,
  Menu,
  X,
  LogOut,
  Search,
  Bell,
  Activity,
  History,
  Monitor,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface AppShellProps {
  children: ReactNode;
  userName?: string | null;
  role: "GYM_OWNER" | "EMPLOYEE";
  gymId: string;
}

export function AppShell({
  children,
  userName,
  role,
}: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const navSections = [
    {
      label: "Operations",
      items: [
        { label: "Overview", icon: LayoutDashboard, href: "/app" as Route },
        { label: "Members", icon: Users, href: "/app/members" as Route },
        { label: "Attendance", icon: History, href: "/app/attendance" as Route },
        { label: "Branches", icon: GitBranch, href: "/app/branches" as Route },
        { label: "Kiosk", icon: Monitor, href: "/app/kiosk" as Route },
      ],
    },
    {
      label: "Infrastructure",
      items: [
        { label: "Hardware Agents", icon: Cpu, href: "/app/agents" as Route },
        { label: "Branch Activity", icon: Activity, href: "/app/activity" as Route },
      ],
    },
    ...(role === "GYM_OWNER" ? [
      {
        label: "Management",
        items: [
          { label: "Staff", icon: Users, href: "/app/staff" as Route },
          { label: "Settings", icon: Settings, href: "/app/settings" as Route },
        ],
      }
    ] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSidebar]);

  const SidebarItem = ({ icon: Icon, label, active, onClick, href }: { icon: any, label: string, active: boolean, onClick: () => void, href: Route }) => (
    <Link 
      href={href}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
        active 
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow-sm' 
          : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'group-hover:text-white'}`} />
      <span className="font-medium text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
    </Link>
  );

  return (
    <div className="relative min-h-screen text-white bg-[#0A0A0A] overflow-x-hidden flex flex-col md:flex-row">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <header
        className={`fixed top-0 left-0 right-0 ${sidebarOpen ? "z-30" : "z-50"} md:hidden border-b border-white/5 px-4 py-3 backdrop-blur-md bg-white/[0.01] flex justify-between items-center`}
      >
        <div className="flex items-center gap-3">
            <Image src="/app/gymcentrix-logo.png" alt="Logo" width={20} height={20} className="brightness-0 invert" />
            <span className="font-display font-bold text-white tracking-tighter uppercase">GYMCENTRIX</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg transition text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/5 bg-[#0A0A0A]/80 md:bg-white/[0.02] backdrop-blur-2xl p-4 md:p-6 space-y-6 md:space-y-8 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto`}
      >
        <div className="flex justify-between items-center mb-2 md:mb-0">
          <div className="flex items-center gap-3 px-2">
            <Image src="/app/gymcentrix-logo.png" alt="Logo" width={28} height={28} className="brightness-0 invert" />
            <div className="flex flex-col">
               <span className="font-display font-bold text-white tracking-tighter text-base md:text-lg uppercase leading-tight">GYMCENTRIX</span>
               <span className="text-[8px] font-black uppercase text-primary tracking-[0.2em] leading-tight">
                 {role === "GYM_OWNER" ? "OWNER PORTAL" : "STAFF PORTAL"}
               </span>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto">
          {navSections.map((section, idx) => (
            <div key={section.label}>
              {idx > 0 && <div className="border-t border-white/5 mb-3" />}
              <p className="px-4 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{section.label}</p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarItem 
                    key={item.label}
                    icon={item.icon} 
                    label={item.label} 
                    active={isActive(item.href)} 
                    onClick={closeSidebar} 
                    href={item.href}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto">
           <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-4 group hover:border-white/10 transition-colors">
              <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-2">Facility Access</p>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full border border-primary/20 bg-primary/10 p-0.5 shrink-0">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary/40 to-primary/80" />
                 </div>
                 <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{userName || "User"}</p>
                    <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase mt-0.5 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Authenticated
                    </p>
                 </div>
              </div>
           </div>
           <button 
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
           >
              <LogOut className="w-4 h-4" />
              Sign Out
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen relative z-10 bg-white/[0.01]">
        <header className="hidden md:flex h-16 border-b border-white/5 px-8 items-center justify-between sticky top-0 bg-white/[0.01] backdrop-blur-md z-20">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex-1 max-w-md">
             <Search className="w-4 h-4 text-white/20 shrink-0" />
             <input 
               type="text" 
               placeholder="Search members or logs..." 
               className="bg-transparent border-none text-xs text-white placeholder:text-white/20 focus:ring-0 w-full p-0 outline-none" 
             />
          </div>
          <div className="flex items-center gap-6 ml-4">
             <div className="relative cursor-pointer hover:text-white text-white/40 transition-colors">
               <Bell className="w-5 h-5" />
               <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-black shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden p-6 md:p-8 pt-24 md:pt-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
