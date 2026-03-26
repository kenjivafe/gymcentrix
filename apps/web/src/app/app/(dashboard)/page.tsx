import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users, Activity, Building2, TrendingUp, UserCheck, History, UserPlus, GitBranch } from "lucide-react";
import Link from "next/link";

const StatCard = ({ icon: Icon, label, value, trend, trendUp }: { icon: any, label: string, value: string | number, trend: string, trendUp: boolean }) => (
  <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black ${trendUp ? 'text-emerald-400' : 'text-rose-400'} uppercase tracking-widest`}>
        {trendUp ? '+' : '-'}{trend}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-black">{label}</p>
      <h4 className="text-3xl font-display font-bold text-white tracking-tight">{value}</h4>
    </div>
  </div>
);

export default async function AppPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const gymId = user?.gymId;

  if (!gymId) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
          <Activity className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Configuration Error</h2>
        <p className="text-sm text-white/40 max-w-sm">
          Your account is not currently linked to a gym facility. 
          Please contact our support cluster to initialize your deployment.
        </p>
      </div>
    );
  }

  const [memberCount, branchCount, activeToday, recentAttendance] = await Promise.all([
    prisma.member.count({ where: { gymId } }),
    prisma.branch.count({ where: { gymId } }),
    prisma.attendance.count({ 
      where: { 
        branch: { gymId },
        timestamp: { gte: new Date(new Date().setHours(0,0,0,0)) }
      } 
    }),
    prisma.attendance.findMany({
      where: { branch: { gymId } },
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        member: true,
        branch: true
      }
    })
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Facility Overview</h2>
           <p className="text-sm text-white/40">Monitoring member activity and branch operations across your gym.</p>
        </div>
        <div className="flex gap-3">
           <Link href="/app/members" className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95 flex items-center gap-2">
             <UserPlus className="w-4 h-4" />
             Register Member
           </Link>
           <Link href="/app/attendance" className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 text-white hover:bg-white/5 transition-all">
             View All Logs
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Members" value={memberCount} trend="5.2%" trendUp />
        <StatCard icon={UserCheck} label="Active Today" value={activeToday} trend="12" trendUp />
        <StatCard icon={GitBranch} label="Branches" value={branchCount} trend="0" trendUp />
        <StatCard icon={Activity} label="Scan Rate" value="98%" trend="1.2%" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart (Placeholder) */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h5 className="text-lg font-bold text-white tracking-tight">Attendance Velocity</h5>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Daily Synchronization Metrics</p>
              </div>
            </div>
            <div className="flex-1 flex items-end gap-2.5 px-2 min-h-[200px]">
              {[40, 60, 45, 80, 70, 90, 85].map((h, i) => (
                <div key={i} className="flex-1 h-full flex items-end group/bar relative">
                  <div 
                    className={`w-full ${i === 6 ? 'bg-primary' : 'bg-white/10'} rounded-t-lg group-hover/bar:bg-primary transition-all duration-500 cursor-pointer relative shadow-glow-sm`} 
                    style={{ height: `${Math.max(10, h)}%` }}
                  >
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 px-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(m => (
                <span key={m} className="text-[9px] text-white/20 uppercase font-black tracking-widest">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Recent Activity */}
        <div className="space-y-6">
           <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
             <div className="flex items-center justify-between mb-8">
               <h6 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Recent Tap Events</h6>
               <Link href="/app/attendance" className="text-[10px] font-bold text-primary hover:underline">View All</Link>
             </div>
             <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {recentAttendance.length === 0 ? (
                  <p className="text-xs text-white/20 italic">No tap events recorded today.</p>
                ) : (
                  recentAttendance.map((log) => (
                    <div key={log.id} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <UserCheck className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{log.member.name}</p>
                        <p className="text-[10px] text-white/30 truncate uppercase tracking-widest font-medium mt-0.5">{log.branch.name}</p>
                      </div>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
             </div>

           </div>

           {/* Branch Health Status (Preview) */}
           <div className="p-8 rounded-3xl border border-white/5 bg-emerald-400/5 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Network Nominal</span>
               </div>
               <h4 className="text-xl font-display font-bold text-white mb-2 underline underline-offset-8 decoration-emerald-400/20">Operational</h4>
               <p className="text-xs text-white/40 leading-relaxed font-medium">All edge biometric nodes are reporting synchronized heartbeats.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
