import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { History, UserCheck, Clock, MapPin, Search, Calendar } from "lucide-react";

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const gymId = user?.gymId;

  if (!gymId) return null;

  const logs = await prisma.attendance.findMany({
    where: { 
      branch: { gymId } 
    },
    include: {
      member: true,
      branch: true,
      agent: true,
    },
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Access History</h2>
           <p className="text-sm text-white/40 font-medium">Real-time audit of all RFID tap events across your branches.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search member..."
                className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium w-64"
              />
           </div>
           <button className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <Calendar className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Member</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Branch Node</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight hidden md:table-cell">Hardware Agent</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center">
                   <div className="flex flex-col items-center justify-center opacity-20">
                      <History className="w-12 h-12 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest">No access events recorded</p>
                   </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                        <UserCheck className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{log.member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <MapPin className="w-3.5 h-3.5 text-white/20" />
                       <span className="text-xs font-bold text-white/60">{log.branch.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5 text-white/20" />
                       <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                     <span className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">
                       {log.agent?.name || 'MANUAL_ENTRY'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 uppercase tracking-widest">
                        Approved
                     </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
