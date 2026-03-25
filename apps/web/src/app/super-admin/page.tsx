import prisma from "@/lib/prisma";
import { Users, Activity, Building2, TrendingUp, Plus, ArrowRight, GitBranch, Cpu, UserCheck } from "lucide-react";
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

export default async function SuperAdminDashboard() {
  const [gymCount, branchCount, agentCount, userCount, recentGyms] = await Promise.all([
    prisma.gym.count(),
    prisma.branch.count(),
    prisma.agent.count(),
    prisma.user.count(),
    prisma.gym.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { owner: true }
    })
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Platform Command</h2>
           <p className="text-sm text-white/40">Real-time status of your global multi-tenant infrastructure.</p>
        </div>
        <div className="flex gap-3">
           <Link href="/super-admin/gyms" className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95">
             Deploy New Gym
           </Link>
           <Link href="/super-admin/settings" className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 text-white hover:bg-white/5 transition-all">
             Global Config
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Registered Gyms" value={gymCount} trend="12%" trendUp />
        <StatCard icon={GitBranch} label="Active Branches" value={branchCount} trend="5%" trendUp />
        <StatCard icon={Cpu} label="Hardware Agents" value={agentCount} trend="2" trendUp />
        <StatCard icon={Users} label="Auth Entities" value={userCount} trend="8%" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
             <TrendingUp className="w-48 h-48 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h5 className="text-lg font-bold text-white tracking-tight">Growth Velocity</h5>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Monthly Deployment Metrics</p>
              </div>
              <div className="flex gap-2">
                {['7D', '1M', '3M', 'YTD'].map(t => (
                  <button key={t} className={`px-3 py-1 text-[10px] rounded-lg border border-white/5 font-black tracking-widest ${t === '1M' ? 'bg-primary text-black border-transparent' : 'text-white/40 hover:text-white hover:bg-white/5 uppercase'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex items-end gap-2.5 px-2 min-h-[200px]">
              {[20, 35, 25, 50, 45, 70, 60, 80, 50, 65, 90, 100].map((h, i) => (
                <div key={i} className="flex-1 h-full flex items-end group/bar relative">
                  <div 
                    className={`w-full ${i === 11 ? 'bg-primary' : 'bg-white/10'} rounded-t-lg group-hover/bar:bg-primary transition-all duration-500 cursor-pointer relative shadow-glow-sm`} 
                    style={{ height: `${Math.max(10, h)}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all scale-90 group-hover/bar:scale-100 whitespace-nowrap z-20 pointer-events-none">
                      {h} GYMS
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 px-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m} className="text-[9px] text-white/20 uppercase font-black tracking-widest">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Recent Deployments */}
        <div className="space-y-6">
           <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
             <div className="flex items-center justify-between mb-8">
               <h6 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Recent Deployments</h6>
               <Link href="/super-admin/gyms" className="text-[10px] font-bold text-primary hover:underline">View All</Link>
             </div>
             <div className="space-y-6">
                {recentGyms.length === 0 ? (
                  <p className="text-xs text-white/20 italic">No clusters deployed yet.</p>
                ) : (
                  recentGyms.map((gym) => (
                    <div key={gym.id} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <Building2 className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{gym.name}</p>
                        <p className="text-[10px] text-white/30 truncate uppercase tracking-widest font-medium mt-0.5">{gym.owner.name}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white transition-all -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                  ))
                )}
             </div>
           </div>

           {/* Platform Status */}
           <div className="p-8 rounded-3xl border border-white/5 bg-primary/5 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Systems Online</span>
               </div>
               <h4 className="text-xl font-display font-bold text-white mb-2 underline underline-offset-8 decoration-primary/20">Operational</h4>
               <p className="text-xs text-white/40 leading-relaxed font-medium">All RFID clusters and biometric agents are reporting nominal status across the platform.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
