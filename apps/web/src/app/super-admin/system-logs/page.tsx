import prisma from "@/lib/prisma";
import { ScrollText, Cpu, UserCheck, Shield, AlertCircle, Clock, Search, Filter } from "lucide-react";

export default async function SystemLogsPage() {
  // Combine different events into a log stream 
  // (In a real app, this would be a dedicated AuditLog table)
  const [attendanceLogs, gymLogs, agentLogs] = await Promise.all([
    prisma.attendance.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        member: true,
        branch: true
      }
    }),
    prisma.gym.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { owner: true }
    }),
    prisma.agent.findMany({
      take: 5,
      orderBy: { lastSeen: "desc" },
      include: { branch: true }
    })
  ]);

  // Transform and Merge
  const combinedLogs = [
    ...attendanceLogs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      type: "ATTENDANCE",
      source: "RFID Agent",
      message: `${log.member.name} checked into ${log.branch.name}`,
      level: "INFO",
      icon: UserCheck
    })),
    ...gymLogs.map(log => ({
      id: log.id,
      timestamp: log.createdAt,
      type: "RESOURCE",
      source: "System",
      message: `New Gym "${log.name}" registered by ${log.owner.name}`,
      level: "SUCCESS",
      icon: Shield
    })),
    ...agentLogs.filter(a => a.lastSeen).map(log => ({
      id: log.id,
      timestamp: log.lastSeen!,
      type: "HARDWARE",
      source: log.name,
      message: `Agent heartbeat received from ${log.branch.name}`,
      level: "INFO",
      icon: Cpu
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">System Logs</h2>
           <p className="text-sm text-white/40">Audit trail of all administrative and automated hardware events.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative group/search">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover/search:text-primary transition-colors" />
             <input 
               type="text" 
               placeholder="Filter signals..." 
               className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all w-64"
             />
           </div>
           <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
             <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        {combinedLogs.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <ScrollText className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xl font-bold text-white">Silence in the logs</p>
            <p className="text-white/40 mt-2 text-sm max-w-sm">System events will appear here once the platform sees activity.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Signal</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Origin</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {combinedLogs.map((log) => (
                  <tr key={log.id + log.type} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-white/20" />
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-white/80">{new Date(log.timestamp).toLocaleTimeString()}</span>
                           <span className="text-[10px] text-white/20">{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 ${
                           log.level === 'SUCCESS' ? 'text-emerald-400' : 'text-primary/60'
                         }`}>
                           <log.icon className="w-4 h-4" />
                         </div>
                         <span className="text-xs font-medium text-white/60">{log.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-white/90 max-w-md truncate font-medium">{log.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{log.source}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                         log.level === 'SUCCESS' 
                           ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' 
                           : 'bg-primary/10 text-primary border-primary/20'
                       }`}>
                         {log.level}
                       </span>
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
