import prisma from "@/lib/prisma";
import { Users, Activity, Building2, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

const StatCard = ({ icon: Icon, label, value, trend, trendUp }: { icon: any, label: string, value: string | number, trend: string, trendUp: boolean }) => (
  <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trendUp ? '+' : '-'}{trend}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">{label}</p>
      <h4 className="text-3xl font-display font-bold text-white tracking-tight">{value}</h4>
    </div>
  </div>
);

export default async function SuperAdminDashboard() {
  const [gymCount, ownerCount] = await Promise.all([
    prisma.gym.count(),
    prisma.user.count({ where: { role: "GYM_OWNER" } }),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header section is lighter now because the sidebar/topbar handles branding */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Platform Overview</h2>
           <p className="text-sm text-white/40">Manage global multitenant infrastructure and tenant growth.</p>
        </div>
        <div className="flex gap-3">
           <Link href="/super-admin/gyms" className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all">
             Register Gym
           </Link>
           <Link href="/super-admin/owners" className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 text-white hover:bg-white/5 transition-all">
             Manage Owners
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Total Gyms" value={gymCount} trend="12%" trendUp />
        <StatCard icon={Users} label="Gym Owners" value={ownerCount} trend="8%" trendUp />
        <StatCard icon={TrendingUp} label="Platform Revenue" value="₱0" trend="0%" trendUp />
        <StatCard icon={Activity} label="System Status" value="100%" trend="Healthy" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Main Block */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h5 className="text-lg font-bold text-white">Registration Trends</h5>
            <div className="flex gap-2">
              {['7D', '1M', '3M', 'YTD'].map(t => (
                <button key={t} className={`px-3 py-1 text-xs rounded-lg border border-white/5 font-bold ${t === '1M' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-end gap-2 px-2">
            {/* Placeholder Chart */}
            {[20, 35, 25, 50, 45, 70, 60, 80, 50, 65, 90, 100].map((h, i) => (
              <div key={i} className="flex-1 h-full flex items-end group relative">
                <div 
                  className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-all duration-500 cursor-pointer" 
                  style={{ height: `${Math.max(10, h)}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} Gyms
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
              <span key={m} className="text-[10px] text-white/20 uppercase font-bold">{m}</span>
            ))}
          </div>
        </div>

        {/* System Health / Quick Actions */}
        <div className="space-y-6">
           {/* Retention Circle */}
           <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex flex-col items-center">
             <h6 className="text-[10px] font-bold text-white/60 mb-6 uppercase tracking-widest self-start">Monthly Retention</h6>
             <div className="relative w-32 h-32 mb-4">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="64" cy="64" r="56" className="stroke-white/5 stroke-[8] fill-transparent" />
                 <circle cx="64" cy="64" r="56" className="stroke-primary stroke-[8] fill-transparent transition-all duration-1000" strokeDasharray="351" strokeDashoffset="35" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-xl font-display font-bold text-white">90%</span>
               </div>
             </div>
             <div className="flex justify-around w-full">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span className="text-[10px] font-bold text-white/60 uppercase">Active</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-white/10" />
                 <span className="text-[10px] font-bold text-white/60 uppercase">Churned</span>
               </div>
             </div>
           </div>

           {/* Quick Actions List */}
           <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
             <h6 className="text-[10px] font-bold text-white/60 mb-4 uppercase tracking-widest">System Actions</h6>
             <div className="space-y-2">
               <Link href="/super-admin/gyms" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <Plus className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-white">New Deployment</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
               </Link>
               <Link href="/super-admin/owners" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 group-hover:scale-110 transition-transform">
                     <Users className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-white">Owner Access</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
               </Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
