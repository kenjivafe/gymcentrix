import prisma from "@/lib/prisma";
import { Users, Activity, ArrowUpRight, Plus } from "lucide-react";
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
      icon: <Buildings className="size-6 text-primary" />,
      href: "/super-admin/gyms",
    },
    {
      label: "Gym Owners",
      value: ownerCount,
      icon: <Users className="size-6 text-primary" />,
      href: "/super-admin/owners",
    },
    {
      label: "System Status",
      value: "Healthy",
      icon: <Activity className="size-6 text-primary" />,
      href: "#",
    },
  ];

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-primary font-bold">
          System Command
        </div>
        <h2 className="text-5xl font-display font-bold tracking-tighter text-white">
          System <span className="text-primary italic">Overview</span>
        </h2>
        <p className="text-lg text-white/40 max-w-2xl font-sans">
          Monitor your multitenant infrastructure and tenant growth across all registered gym facilities globally.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href as any}
            className="group relative overflow-hidden p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] shadow-glow hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowUpRight className="size-8 text-primary" />
            </div>
            <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                {stat.icon}
            </div>
            <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] font-sans">
              {stat.label}
            </p>
            <p className="text-5xl font-display font-bold text-white mt-4 tracking-tighter">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent border border-white/5 rounded-[4rem] p-12 lg:p-20 shadow-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <div className="space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow">
                  <Plus className="size-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-display font-bold text-white tracking-tighter">
                    Quick <span className="text-primary">Actions</span>
                  </h3>
                  <p className="text-white/40 max-w-md font-sans">
                      Instantly deploy new gym environments or manage administrative credentials for existing tenant owners.
                  </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-6 w-full lg:w-auto">
              <Link
                href={"/super-admin/gyms" as any}
                className="flex-1 lg:flex-none text-center px-12 py-6 bg-primary hover:scale-105 active:scale-95 text-black font-bold rounded-2xl shadow-glow-strong transition-all uppercase tracking-widest text-sm"
              >
                Register Gym
              </Link>
              <Link
                href={"/super-admin/owners" as any}
                className="flex-1 lg:flex-none text-center px-12 py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-sm font-sans"
              >
                Manage Owners
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

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
