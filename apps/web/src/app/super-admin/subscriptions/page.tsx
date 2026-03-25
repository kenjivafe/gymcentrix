import prisma from "@/lib/prisma";
import { Receipt, Building2, Calendar, CreditCard, ChevronRight, Filter, Search, Download } from "lucide-react";

export default async function SubscriptionsPage() {
  const gyms = await prisma.gym.findMany({
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Subscriptions</h2>
           <p className="text-sm text-white/40">Monitor and manage billing status for all gym tenants.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5 transition-all">
             <Download className="w-4 h-4" />
             Export Report
           </button>
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95">
             <CreditCard className="w-4 h-4" />
             Billing Engine
           </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
           <div className="relative group/search flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover/search:text-primary transition-colors" />
             <input 
               type="text" 
               placeholder="Search tenant billing..." 
               className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all w-full"
             />
           </div>
           <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
                <Filter className="w-3.5 h-3.5" />
              </button>
           </div>
        </div>

        {gyms.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Receipt className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xl font-bold text-white">No active subscriptions</p>
            <p className="text-white/40 mt-2 text-sm max-w-sm">When gyms register, their billing status will be tracked here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Gym Tenant</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Plan</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden xl:table-cell">Next Invoice</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden lg:table-cell">Usage Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {gyms.map((gym: any, idx) => (
                  <tr key={gym.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Building2 className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{gym.name}</p>
                          <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">{gym.owner.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                         idx === 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/10 text-white/60 border-white/10'
                       }`}>
                         {idx === 0 ? "PRO" : "LITE"}
                       </span>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-white/20" />
                        <span className="text-xs text-white/60">Oct 24, 2026</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex flex-col gap-1.5 w-32">
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full bg-primary/40 rounded-full`} style={{ width: idx === 0 ? '78%' : '24%' }} />
                         </div>
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{idx === 0 ? '780 / 1000 Slots' : '24 / 100 Slots'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          PAID
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-white/20 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
