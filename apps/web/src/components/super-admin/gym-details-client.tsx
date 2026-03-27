"use client";

import { useState } from "react";
import { Building2, Edit2, Plus, Lock } from "lucide-react";
import Link from "next/link";
import { EditGymModal } from "@/components/super-admin/edit-gym-modal";
import { AddBranchModal } from "@/components/super-admin/add-branch-modal";

interface GymDetailsClientProps {
  gym: {
    id: string;
    name: string;
    owner: {
      name: string;
      email: string;
    };
    plan: "BASIC" | "PRO" | "ENTERPRISE";
  };
  branchCount: number;
}

export function GymDetailsClient({ gym, branchCount }: GymDetailsClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);

  const canAddBranch = gym.plan === 'ENTERPRISE' || branchCount === 0;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/super-admin/gyms" 
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors flex items-center gap-1"
            >
              <Building2 className="w-3 h-3" />
              Gyms
            </Link>
            <span className="text-white/10">/</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Details</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">{gym.name}</h2>
            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-[0.2em] mt-1 ${
              gym.plan === 'ENTERPRISE' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
              gym.plan === 'PRO' ? 'bg-primary/10 text-primary border-primary/20' :
              'bg-slate-400/10 text-slate-400 border-slate-400/20'
            }`}>
              {gym.plan} Plan
            </span>
          </div>
          <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em] mt-0.5">Gym Cluster ID: {gym.id}</p>

        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-white/5 text-white/60 border border-white/10 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <Edit2 className="w-4 h-4" />
            Edit Facility
          </button>
          
          {canAddBranch ? (
            <button 
              onClick={() => setIsAddBranchModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-primary text-black hover:shadow-glow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Branch
            </button>
          ) : (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-white/5 text-white/20 border border-white/5 cursor-not-allowed group relative">
              <Lock className="w-4 h-4" />
              Add Branch
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-[10px] text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 Upgrade to <span className="text-violet-400 font-bold">Enterprise</span> for multi-location clusters
              </div>
            </div>
          )}
        </div>
      </div>


      {isEditModalOpen && (
        <EditGymModal 
          gym={gym} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}

      {isAddBranchModalOpen && (
        <AddBranchModal 
          onClose={() => setIsAddBranchModalOpen(false)}
          defaultGymId={gym.id}
        />
      )}
    </>
  );
}
