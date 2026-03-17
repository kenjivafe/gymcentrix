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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          System Overview
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor your multitenant infrastructure and tenant growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href as any}
            className="group p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                {stat.icon}
              </div>
              <ArrowUpRight className="size-5 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href={"/super-admin/gyms" as any}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Register New Gym
          </Link>
          <Link
            href={"/super-admin/owners" as any}
            className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold rounded-xl transition-colors"
          >
            Manage Owners
          </Link>
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
