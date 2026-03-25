import prisma from "@/lib/prisma";
import { BarChart3, Users, Calendar, ArrowUpRight, ArrowDownRight, Activity, Building2, UserCheck } from "lucide-react";

export default async function AnalyticsPage() {
  // Fetch some real stats
  const [totalGyms, totalMembers, totalAttendance, recentAttendance] = await Promise.all([
    prisma.gym.count(),
    prisma.member.count(),
    prisma.attendance.count(),
    prisma.attendance.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        member: true,
        branch: true
      }
    })
  ]);

  const stats = [
    { label: "Total Gyms", value: totalGyms, icon: Building2, trend: "+12%", trendUp: true },
    { label: "Active Members", value: totalMembers, icon: Users, trend: "+5.4%", trendUp: true },
    { label: "Total Check-ins", value: totalAttendance, icon: UserCheck, trend: "+18.2%", trendUp: true },
    { label: "Live Agents", value: "8/12", icon: Activity, trend: "-2", trendUp: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Intelligence & Analytics</h2>
           <p className="text-sm text-white/40">Real-time platform metrics and attendance distribution.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Calendar className="w-4 h-4 text-white/40" />
          <span className="text-xs font-bold text-white/60">Last 30 Days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <stat.icon className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col min-h-[400px]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Growth Trajectory
              </h3>
           </div>
           <div className="flex-1 flex items-center justify-center border-t border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
              <div className="text-center space-y-2 relative z-10">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                   <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
                </div>
                <p className="text-sm font-bold text-white/60">Chart Engine Initializing...</p>
                <p className="text-[10px] text-white/20 uppercase tracking-widest">Collecting data-points for visualization</p>
              </div>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
           <h3 className="font-bold text-white mb-6 flex items-center gap-2">
             <Activity className="w-4 h-4 text-primary" />
             Live Stream
           </h3>
           <div className="space-y-6">
              {recentAttendance.length === 0 ? (
                <p className="text-xs text-white/20 italic">No recent check-ins detected.</p>
              ) : (
                recentAttendance.map((log) => (
                  <div key={log.id} className="flex gap-4 relative">
                    <div className="w-px h-full bg-white/5 absolute left-4 top-8" />
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-xs font-bold text-white truncate">{log.member.name}</p>
                       <p className="text-[10px] text-white/40 truncate">
                         Checked in at <span className="text-white/60">{log.branch.name}</span>
                       </p>
                       <p className="text-[9px] text-white/20 font-mono mt-1">
                         {new Date(log.timestamp).toLocaleTimeString()}
                       </p>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
