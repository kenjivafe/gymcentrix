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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Stats & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-6">
            <StatCard icon={Users} label="Total Members" value={memberCount} trend="5.2%" trendUp />
            <StatCard icon={UserCheck} label="Active Today" value={activeToday} trend="12" trendUp />
          </div>

          {/* Main Growth Chart (Placeholder) */}
          <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group h-[450px]">
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
        </div>

        {/* Right column: Recent Activity */}
        <div className="space-y-6">
           <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
             <div className="flex items-center justify-between mb-8">
               <h6 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Recent Tap Events</h6>
               <Link href="/app/attendance" className="text-[10px] font-bold text-primary hover:underline">View All</Link>
             </div>
             <div className="flex flex-col -space-y-[150px] pb-24 pt-4 group/stack">
                {recentAttendance.length === 0 ? (
                  <p className="text-xs text-white/20 italic">No tap events recorded today.</p>
                ) : (
                  recentAttendance.map((log, index) => (
                    <div 
                      key={log.id} 
                      style={{ zIndex: index === 0 ? 60 : 50 - index }}
                      className={`relative bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] transition-all duration-500 shadow-2xl group/card overflow-hidden h-[220px] w-full cursor-pointer
                      ${index === 0 
                        ? '-translate-y-8 -rotate-1 ring-1 ring-primary/20 group-hover/stack:translate-y-0 group-hover/stack:rotate-0 group-hover/stack:ring-0 group-hover/stack:z-[50] hover:!z-[70] hover:!-translate-y-8 hover:!-rotate-1 hover:!ring-1 hover:!ring-primary/20' 
                        : 'hover:-translate-y-8 hover:-rotate-1 hover:!z-[70]'}`}
                    >
                      {/* TOP SECTION */}
                      <div className={`absolute top-8 left-8 right-8 flex flex-col gap-6 transition-all duration-500 delay-75 text-left
                        ${index === 0 
                          ? 'opacity-100 translate-y-0 group-hover/stack:opacity-0 group-hover/stack:translate-y-4 hover:!opacity-100 hover:!translate-y-0' 
                          : 'opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0'}`}>
                         <div className="flex justify-between items-start">
                            <div className="space-y-1">
                               <p className="text-[10px] text-primary uppercase tracking-[0.3em] font-black">Authorized</p>
                               <p className="text-sm font-bold text-white/40">Biometric Verification</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest leading-none transition-colors
                               ${index === 0 ? 'bg-primary/10 border-primary/20 text-primary group-hover/stack:bg-white/5 group-hover/stack:border-white/10 group-hover/stack:text-white/20 hover:!bg-primary/10 hover:!border-primary/20 hover:!text-primary' : 'bg-white/5 border-white/10 text-white/20 group-hover/card:text-primary group-hover/card:border-primary/20'}`}>
                               RFID Node 01
                            </div>
                         </div>
                         
                         <div className="pt-4 border-t border-white/5">
                            <span className={`text-4xl font-display font-black transition-colors uppercase tracking-tighter
                               ${index === 0 ? 'text-white/40 group-hover/stack:text-white/10 hover:!text-white/40' : 'text-white/10 group-hover/card:text-white/20'}`}>
                               {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                         </div>
                      </div>

                       {/* BOTTOM SECTION (Always visible) */}
                      <div className="absolute bottom-6 left-8 right-8 flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 shadow-inner
                           ${index === 0 
                             ? 'bg-primary/20 border-primary/20 group-hover/stack:bg-white/5 group-hover/stack:border-white/5 hover:!bg-primary/20 hover:!border-primary/20' 
                             : 'bg-white/5 border-white/5 group-hover/card:bg-primary/20 group-hover/card:border-primary/20'}`}>
                           <UserCheck className={`w-6 h-6 transition-all ${index === 0 ? 'text-primary group-hover/stack:text-white/40 hover:!text-primary' : 'text-white/40 group-hover/card:text-primary'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className={`font-display font-bold tracking-tight text-white transition-all truncate
                              ${index === 0 ? 'text-2xl group-hover/stack:text-base hover:!text-2xl' : 'group-hover/card:text-2xl'}`}>{log.member.name}</p>
                           <div className="flex items-center gap-2 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black truncate">{log.branch.name}</p>
                           </div>
                        </div>
                      </div>
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
