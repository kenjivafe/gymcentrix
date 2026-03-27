import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GitBranch, MapPin, Building2, Cpu, ChevronRight, Activity, Lock, Plus } from "lucide-react";
import Link from "next/link";
import { ActivateBranchButton } from "@/components/app/activate-branch-button";

export default async function DashboardBranchesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const gymId = user?.gymId;

  if (!gymId) return null;

  const gym = await prisma.gym.findUnique({
    where: { id: gymId }
  });

  const branches = await prisma.branch.findMany({
    where: { gymId },
    include: {
      agents: true,
      _count: {
        select: {
          members: true,
          attendance: true,
        }
      }
    },
    orderBy: { createdAt: "asc" },
  });

  const effectiveActiveId = (gym as any)?.activeBranchId || branches[0]?.id;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Branch Management</h2>
           <p className="text-sm text-white/40">Overview of your physical locations and their infrastructure status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.02] rounded-3xl">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                <GitBranch className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xl font-bold text-white">No branches established</p>
            <p className="text-white/40 mt-2 text-sm max-w-sm font-medium">Contact platform support to expand your gym infrastructure clusters.</p>
          </div>
        ) : (
          branches.map((branch) => {
            const isLocked = (gym as any)?.plan !== 'ENTERPRISE' && branch.id !== effectiveActiveId;
            const isActive = branch.id === effectiveActiveId;

            return (
              <div key={branch.id} className="relative group">
                <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden h-full ${
                  isLocked 
                    ? 'bg-white/[0.01] border-white/5 grayscale opacity-50' 
                    : 'bg-white/[0.02] border-white/5 hover:border-primary/20 hover:bg-primary/[0.02]'
                }`}>
                  <div className="relative z-10 space-y-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-500 shadow-glow-sm ${
                          !isLocked && 'group-hover:bg-primary/10 group-hover:border-primary/20 text-white/40 group-hover:text-primary'
                        }`}>
                            <Building2 className="w-7 h-7" />
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {/* Subscription Tier Status Badge */}
                          {isLocked && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-glow-sm">
                              <Lock className="w-3 h-3 text-rose-400" />
                              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none">Locked</span>
                            </div>
                          )}

                          {isActive && !isLocked && (gym as any)?.plan !== 'ENTERPRISE' && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 shadow-glow-sm">
                              <Activity className="w-3 h-3 text-primary animate-pulse" />
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Active Branch</span>
                            </div>
                          )}

                          {/* Operational Status Badge */}
                          {!isLocked && (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-glow-sm whitespace-nowrap ${
                                branch.agents.some(a => a.status === 'ONLINE')
                                  ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                                  : 'bg-rose-400/10 text-rose-400 border-rose-400/20'
                            }`}>
                                <div className={`w-1 h-1 rounded-full ${branch.agents.some(a => a.status === 'ONLINE') ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                                <span className="leading-none mt-[0.5px]">
                                  {branch.agents.some(a => a.status === 'ONLINE') ? 'Operational' : 'Offline'}
                                </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className={`text-xl font-display font-bold transition-colors tracking-tight ${
                          isLocked ? 'text-white/20' : 'text-white group-hover:text-primary'
                        }`}>{branch.name}</h3>
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black mt-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {branch.address || 'Location Pending'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Identity</p>
                            <p className="text-[10px] font-mono text-white/40 truncate">{branch.id}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Active Members</p>
                            <p className="text-xs font-bold text-white/80">{branch._count.members}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Hardware Nodes</p>
                            <div className="flex items-center gap-1.5">
                              {branch.agents.length === 0 ? (
                                <span className="text-[10px] text-white/20 italic">No agents registered</span>
                              ) : (
                                branch.agents.map(agent => (
                                  <div key={agent.id} className={`w-2 h-2 rounded-full ${agent.status === 'ONLINE' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-white/10'}`} title={agent.name} />
                                ))
                              )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Scan Count</p>
                            <p className="text-[10px] font-bold text-white/60">{branch._count.attendance}</p>
                        </div>
                      </div>
                  </div>
                </div>

                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] z-30 select-none cursor-default p-6">
                    <div className="flex flex-col items-center gap-6 text-center">
                       <div className="space-y-3">
                          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-black/80 px-6 py-3 rounded-full border border-white/10 shadow-glow-sm truncate max-w-[280px]">Enterprise Plan Required</p>
                          <p className="text-[8px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">Upgrade to Enterprise to manage multiple branches</p>
                       </div>
                       
                       <div className="pt-8 border-t border-white/5 w-full flex justify-center mt-4">
                          <ActivateBranchButton 
                            gymId={gymId} 
                            branchId={branch.id} 
                          />
                       </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Add Branch Card (Always visible, state depends on plan) */}
        {branches.length > 0 && (
          <div className="relative group cursor-pointer md:cursor-default">
            <div className={`p-8 rounded-[2.5rem] border border-dashed transition-all duration-500 h-full flex flex-col items-center justify-center text-center gap-6 ${
              (gym as any)?.plan !== 'ENTERPRISE'
                ? 'bg-white/[0.01] border-white/5 grayscale opacity-50'
                : 'bg-white/[0.02] border-white/10 hover:border-primary/40 hover:bg-primary/[0.02]'
            }`}>
              <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-500 ${
                (gym as any)?.plan === 'ENTERPRISE' && 'group-hover:bg-primary/10 group-hover:border-primary/20 text-white/40 group-hover:text-primary'
              }`}>
                <Plus className="w-8 h-8" />
              </div>
              <div className="space-y-1 select-none">
                <p className="text-xl font-display font-bold text-white tracking-tight">Expand Infrastructure</p>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">Add New Branch</p>
              </div>
            </div>

            {(gym as any)?.plan !== 'ENTERPRISE' && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2.5rem] z-30 select-none cursor-default">
                <div className="flex flex-col items-center gap-3">
                   <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-black/80 px-6 py-3 rounded-full border border-white/10 shadow-glow-sm truncate max-w-[280px]">Enterprise Plan Required</p>
                   <p className="text-[8px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">Upgrade to Enterprise to add new branch</p>
                </div>
              </div>
            )}

            {(gym as any)?.plan === 'ENTERPRISE' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2.5rem] z-30">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-6 py-3 rounded-full border border-primary/20 shadow-glow-sm">Coming Soon</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
