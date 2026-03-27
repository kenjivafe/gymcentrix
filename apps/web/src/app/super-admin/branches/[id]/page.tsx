import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Building2, MapPin, Calendar, GitBranch, Cpu, Activity, User2, ArrowRight, ChevronRight, History } from "lucide-react";
import { BranchDetailsClient } from "@/components/super-admin/branch-details-client";
import Link from "next/link";

export default async function BranchViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const branch = await prisma.branch.findUnique({
    where: { id: resolvedParams.id },
    include: {
      gym: {
        include: {
          branches: {
            orderBy: { createdAt: 'asc' },
            select: { id: true }
          }
        }
      },
      agents: {
        orderBy: {
          lastSeen: "desc",
        },
      },
      _count: {
        select: {
          members: true,
          attendance: true,
        }
      }
    }
  });

  if (!branch) notFound();

  const effectiveActiveId = (branch.gym as any).activeBranchId || branch.gym.branches[0]?.id;
  const isLocked = branch.gym.plan !== 'ENTERPRISE' && branch.id !== effectiveActiveId;

  // Fetch recent attendance
  const recentAttendance = await prisma.attendance.findMany({
    where: { branchId: resolvedParams.id },
    include: {
      member: true,
      agent: true,
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 5,
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <BranchDetailsClient branch={branch as any} isLocked={isLocked} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Info */}
        <div className="space-y-6">
          {/* Parent Gym Card */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 relative overflow-hidden group">
            
            <h6 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] relative z-10">Parent Facility</h6>
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white/40" />
               </div>
               <div>
                  <p className="text-sm font-bold text-white">{branch.gym.name}</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-black mt-0.5">Corporate Entity</p>
               </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5 relative z-10">
               <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/20 mt-0.5" />
                  <span className="text-xs text-white/60 font-medium leading-relaxed">{branch.address}</span>
               </div>
            </div>

            <Link 
               href={`/super-admin/gyms/${branch.gym.id}`}
               className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/btn"
            >
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover/btn:text-white transition-colors">Manage Parent Cluster</span>
               <ArrowRight className="w-4 h-4 text-white/20 group-hover/btn:text-primary transition-colors" />
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Total Members</p>
                <div className="flex items-end justify-between">
                   <h4 className="text-2xl font-display font-bold text-white">{branch._count.members}</h4>
                   <User2 className="w-5 h-5 text-primary/40" />
                </div>
             </div>
             <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Total Agents</p>
                <div className="flex items-end justify-between">
                   <h4 className="text-2xl font-display font-bold text-white">{branch.agents.length}</h4>
                   <Cpu className="w-5 h-5 text-primary/40" />
                </div>
             </div>
          </div>

          {/* Network Health */}
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Network Synchronized</span>
               </div>
               <h4 className="text-lg font-display font-bold text-white mb-2">Agent Matrix Active</h4>
               <p className="text-[11px] text-white/40 leading-relaxed font-medium">All edge biometric agents within this branch cluster are reporting healthy status.</p>
             </div>
          </div>
        </div>

        {/* Right Column: Infrastructure & Activity */}
        <div className="lg:col-span-2 space-y-8">
           {/* Agent Grid */}
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-white">Agent Infrastructure</h3>
                 </div>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{branch.agents.length} Total Agents</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {branch.agents.length === 0 ? (
                    <div className="col-span-2 py-12 text-center border border-white/5 border-dashed rounded-3xl bg-white/[0.01]">
                       <p className="text-xs text-white/20 uppercase tracking-widest font-black">No Agents Provisioned</p>
                    </div>
                 ) : (
                    branch.agents.map((agent) => (
                       <div key={agent.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                          <div className="flex items-start justify-between mb-4">
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-colors">
                                <Activity className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                             </div>
                             <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                agent.status === 'ONLINE' 
                                ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' 
                                : 'bg-rose-400/10 text-rose-400 border-rose-400/20'
                             }`}>
                                {agent.status}
                             </div>
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white tracking-tight">{agent.name}</p>
                             <p className="text-[9px] font-mono text-white/20 mt-1 uppercase tracking-widest">ID: {agent.id.slice(-8)}</p>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                             <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Last Pulse</span>
                             <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                {agent.lastSeen ? new Date(agent.lastSeen).toLocaleTimeString() : 'NEVER'}
                             </span>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

           {/* Recent Activity */}
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-white">Recent Access Logs</h3>
                 </div>
                 <button className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors underline decoration-white/10 underline-offset-4">Comprehensive Audit</button>
              </div>

              <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
                 {recentAttendance.length === 0 ? (
                    <div className="py-16 text-center">
                       <p className="text-xs text-white/20 uppercase tracking-widest font-black italic">No Access Events Recorded</p>
                    </div>
                 ) : (
                    <div className="divide-y divide-white/5">
                       {recentAttendance.map((log) => (
                          <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                   <User2 className="w-4 h-4 text-white/20" />
                                </div>
                                <div className="space-y-0.5">
                                   <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{log.member.name}</p>
                                   <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Agent: {log.agent?.name || 'Unknown'}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                <p className="text-[9px] text-white/20 uppercase tracking-widest font-black mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
