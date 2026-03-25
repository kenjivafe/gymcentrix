import prisma from "@/lib/prisma";
import { Cpu, BadgeCheck, Wifi, WifiOff, MapPin, Building2, ChevronRight, Plus } from "lucide-react";

export default async function AgentsManagementPage() {
  const agents = await prisma.agent.findMany({
    include: {
      branch: {
        include: {
          gym: true
        }
      }
    },
    orderBy: {
      lastSeen: "desc",
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Hardware Agents</h2>
           <p className="text-sm text-white/40">Monitor and manage RFID readers deployed at gym branches.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Deploy New Agent
        </button>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
        {agents.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xl font-bold text-white">No agents found</p>
            <p className="text-white/40 mt-2 text-sm max-w-sm">Register a new RFID agent in the API to monitor hardware status.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Hardware Agent</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Deployment</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden md:table-cell">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden lg:table-cell">Last Seen</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden xl:table-cell">API Key</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {agents.map((agent: any) => (
                <tr key={agent.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-colors ${agent.status === 'ONLINE' ? 'text-emerald-400 group-hover:bg-emerald-400/10' : 'text-white/20 group-hover:bg-white/10'}`}>
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{agent.name}</span>
                        <span className="text-[10px] font-medium text-white/20 uppercase tracking-wider">{agent.id.slice(-8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-white/80">
                         <Building2 className="w-3 h-3 text-white/20" />
                         {agent.branch.gym.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                         <MapPin className="w-3 h-3 text-white/20" />
                         {agent.branch.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      agent.status === 'ONLINE' 
                        ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' 
                        : 'bg-rose-400/10 text-rose-400 border-rose-400/20'
                    }`}>
                      {agent.status === 'ONLINE' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                      {agent.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-xs text-white/60">
                      {agent.lastSeen ? new Date(agent.lastSeen).toLocaleString() : "Never"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/5 w-fit">
                      <BadgeCheck className="w-3 h-3 text-primary/40" />
                      <code className="text-[10px] text-white/30 truncate max-w-[80px]">••••{agent.apiKey.slice(-4)}</code>
                    </div>
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
        )}
      </div>
    </div>
  );
}
