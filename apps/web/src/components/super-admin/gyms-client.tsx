"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List, Building2, User2, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AddGymModal } from "@/components/super-admin/add-gym-modal";

interface GymsClientProps {
  gyms: any[];
}

export function GymsClient({ gyms }: GymsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'table' | 'cards'>('cards');

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Registered Gyms</h2>
           <p className="text-sm text-white/40 font-medium">Manage tenant gym facilities and monitor their global status.</p>
        </div>
        
        <div className="flex items-center gap-3">
           {/* View Toggle */}
            <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden shrink-0">
              <button 
                onClick={() => setView('cards')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  view === 'cards' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards
              </button>
              <button 
                onClick={() => setView('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  view === 'table' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Table
              </button>
            </div>


           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-primary text-black hover:shadow-glow transition-all active:scale-95"
           >
             <Plus className="w-4 h-4" />
             Register New Gym
           </button>
        </div>
      </div>

      {gyms.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.02] rounded-3xl">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
              <Building2 className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-xl font-bold text-white">No gyms found</p>
          <p className="text-white/40 mt-2 text-sm max-w-sm font-medium">Register a new gym tenant to get started with deployment.</p>
        </div>
      ) : view === 'table' ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Gym Facility</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Identity</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Deployment</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight hidden xl:table-cell">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gyms.map((gym: any) => (
                <tr key={gym.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Building2 className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{gym.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <User2 className="w-3 h-3 text-white/60" />
                      </div>
                      <span className="text-xs font-bold text-white/80">{gym.owner.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-white/20" />
                       <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{new Date(gym.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 uppercase tracking-widest">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/super-admin/gyms/${gym.id}`}
                      className="text-white/10 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5 inline-block"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym: any) => (
            <div key={gym.id} className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Building2 className="w-24 h-24 text-white" />
               </div>

               <div className="relative z-10 space-y-8">
                  <div className="flex items-start justify-between">
                     <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 shadow-glow-sm">
                        <Building2 className="w-7 h-7 text-white/40 group-hover:text-primary transition-colors" />
                     </div>
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 uppercase tracking-[0.2em]">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                     </span>
                  </div>

                  <div>
                     <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors tracking-tight">{gym.name}</h3>
                     <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black mt-1">Tenant Facility Cluster</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Ownership</p>
                        <p className="text-xs font-bold text-white/80">{gym.owner.name}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Identity</p>
                        <p className="text-[9px] font-mono text-white/40 truncate">{gym.owner.email}</p>
                     </div>
                  </div>

                  <Link 
                     href={`/super-admin/gyms/${gym.id}`}
                     className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:bg-primary group-hover:text-black group-hover:border-transparent transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                     Manage Infrastructure
                     <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {isModalOpen && <AddGymModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
