import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Cpu, Wifi, WifiOff, MapPin, ChevronRight, BadgeCheck } from "lucide-react";
import { CreateAgentModal } from "@/components/app/create-agent-modal";
import { AgentActions } from "@/components/app/agent-actions";

export default async function DashboardAgentsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const gymId = user?.gymId;

  if (!gymId) return null;

  const agents = await prisma.agent.findMany({
    where: { 
      branch: { gymId } 
    },
    include: {
      branch: true
    },
    orderBy: {
      lastSeen: "desc",
    },
  });

  const branches = await prisma.branch.findMany({
    where: { gymId },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Access Points</h2>
           <p className="text-sm text-white/40">Monitor the live status of RFID readers deployed across your facility.</p>
        </div>
        <CreateAgentModal branches={branches} />
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
        {agents.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.02] rounded-3xl">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xl font-bold text-white mb-6">No active agents</p>
            <CreateAgentModal branches={branches} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Hardware Node</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden lg:table-cell">Heartbeat</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden xl:table-cell">Identity</th>
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
                    <div className="flex items-center gap-2 text-xs text-white/60 font-bold">
                       <MapPin className="w-3.5 h-3.5 text-white/20" />
                       {agent.branch.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      agent.status === 'ONLINE' 
                        ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' 
                        : 'bg-rose-400/10 text-rose-400 border-rose-400/20'
                    }`}>
                      {agent.status === 'ONLINE' ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                      {agent.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      {agent.lastSeen ? new Date(agent.lastSeen).toLocaleTimeString() : "NEVER"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/5 w-fit">
                      <BadgeCheck className="w-3 h-3 text-primary/40" />
                      <code className="text-[10px] text-white/30 truncate max-w-[80px]">••••{agent.apiKey.slice(-4)}</code>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <AgentActions agent={agent} />
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
