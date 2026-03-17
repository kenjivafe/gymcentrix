import prisma from "@/lib/prisma";
import { Users, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const [gymCount, ownerCount] = await Promise.all([
    prisma.gym.count(),
    prisma.user.count({ where: { role: "GYM_OWNER" } }),
  ]);

  const stats = [
    {
      label: "Total Gyms",
      value: gymCount,
      icon: <Buildings className="size-6 text-indigo-600" />,
      href: "/super-admin/gyms",
    },
    {
      label: "Gym Owners",
      value: ownerCount,
      icon: <Users className="size-6 text-emerald-600" />,
      href: "/super-admin/owners",
    },
    {
      label: "System Status",
      value: "Healthy",
      icon: <Activity className="size-6 text-blue-600" />,
      href: "#",
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-primary/80 font-bold">Multitenant Infrastructure</p>
        <h2 className="text-4xl font-bold tracking-tight text-white">
          System Overview
        </h2>
        <p className="text-lg text-white/60 max-w-2xl">
          Monitor your multitenant infrastructure and tenant growth across all registered gym facilities.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href as any}
            className="group relative overflow-hidden p-8 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-card hover:bg-white/10 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <ArrowUpRight className="size-8" />
            </div>
            <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {stat.icon}
            </div>
            <p className="text-white/50 text-sm font-medium tracking-wide uppercase">
              {stat.label}
            </p>
            <p className="text-4xl font-bold text-white mt-2">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 border border-white/10 rounded-[3rem] p-10 lg:p-14">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white">
                  Developer Quick Actions
                </h3>
                <p className="text-white/60 max-w-md">
                    Instantly deploy new gym environments or manage administrative credentials for existing tenant owners.
                </p>
            </div>
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <Link
                href={"/super-admin/gyms" as any}
                className="flex-1 lg:flex-none text-center px-10 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                Register Gym
              </Link>
              <Link
                href={"/super-admin/owners" as any}
                className="flex-1 lg:flex-none text-center px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
              >
                Manage Owners
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

// Minimal icon shims because lucide-react might not have Buildings in the exact version
function Buildings({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 22V4c0-.5.2-1 .6-1.4C7 2.2 7.5 2 8 2h8c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18" />
      <path d="M6 18h12" />
      <path d="M6 14h12" />
      <path d="M6 10h12" />
      <path d="M6 6h12" />
      <path d="M2 22h20" />
    </svg>
  );
}
