import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Building2, User2, Mail, MapPin, Calendar, GitBranch, Cpu, Activity, ArrowRight, ChevronRight } from "lucide-react";
import { GymDetailsClient } from "@/components/super-admin/gym-details-client";
import Link from "next/link";

export default async function GymViewPage({ params }: { params: { id: string } }) {
  const gym = await prisma.gym.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      branches: {
        include: {
          _count: {
            select: {
              members: true,
              agents: true,
            }
          }
        }
      }
    }
  });

  if (!gym) notFound();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <GymDetailsClient gym={gym as any} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Info */}
        <div className="space-y-6">
          {/* Owner Card */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
            <h6 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Ownership Node</h6>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User2 className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <p className="text-sm font-bold text-white">{gym.owner.name}</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-black mt-0.5">Primary Administrator</p>
               </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
               <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/20" />
                  <span className="text-xs text-white/60 font-medium">{gym.owner.email}</span>
               </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-white/20" />
                  <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Joined {gym.owner.createdAt ? new Date(gym.owner.createdAt).toLocaleDateString() : 'N/A'}</span>
               </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Branches</p>
                <div className="flex items-end justify-between">
                   <h4 className="text-2xl font-display font-bold text-white">{gym.branches.length}</h4>
                   <GitBranch className="w-5 h-5 text-primary/40" />
                </div>
             </div>
             <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Deployments</p>
                <div className="flex items-end justify-between">
                   <h4 className="text-2xl font-display font-bold text-white">
                      {gym.branches.reduce((acc, b) => acc + b._count.agents, 0)}
                   </h4>
                   <Cpu className="w-5 h-5 text-primary/40" />
                </div>
             </div>
          </div>

          {/* Infrastructure Health */}
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Signal Locked</span>
               </div>
               <h4 className="text-lg font-display font-bold text-white mb-2">Operating Nominal</h4>
               <p className="text-[11px] text-white/40 leading-relaxed font-medium">This tenant cluster is reporting synchronous heartbeats from all edge biometric agents.</p>
             </div>
          </div>
        </div>

        {/* Right Column: Branch Infrastructure */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <GitBranch className="w-5 h-5 text-primary" />
                 <h3 className="text-lg font-bold text-white">Branch Infrastructure</h3>
              </div>
              <button className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Global Management</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gym.branches.length === 0 ? (
                <div className="col-span-2 py-16 text-center border border-white/5 border-dashed rounded-[2rem] bg-white/[0.01]">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <GitBranch className="w-6 h-6 text-white/20" />
                   </div>
                   <p className="text-xs text-white/20 uppercase tracking-[0.2em] font-black mb-6">No Active Branches Found</p>
                </div>
              ) : (
                gym.branches.map((branch) => (
                  <div key={branch.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between mb-6">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-colors">
                          <Activity className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                       </div>
                       <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-sm font-bold text-white tracking-tight">{branch.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <MapPin className="w-3 h-3 text-white/20" />
                             <p className="text-[10px] text-white/40 truncate font-medium">{branch.address}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                   <div key={i} className="w-5 h-5 rounded-full bg-white/5 border-2 border-[#0A0A0A]" />
                                ))}
                             </div>
                             <p className="text-[10px] font-black text-white/30 uppercase tracking-tighter">{branch._count.members} Members</p>
                          </div>
                          <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{branch._count.agents} Agents</p>
                       </div>
                    </div>
                  </div>
                ))
              )}
           </div>
           
           <Link 
             href="/super-admin/branches"
             className="flex items-center justify-center gap-2 p-6 rounded-2xl border border-white/5 border-dashed hover:bg-white/[0.02] hover:border-white/10 transition-all group"
           >
              <GitBranch className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">Manage Global Branch Clusters</span>
              <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white transition-transform group-hover:translate-x-1" />
           </Link>
        </div>
      </div>
    </div>
  );
}
