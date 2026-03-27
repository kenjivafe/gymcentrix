"use client";

import { useState } from "react";
import { GitBranch, Edit2, Plus, Building2, Lock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EditBranchModal } from "@/components/super-admin/edit-branch-modal";

interface BranchDetailsClientProps {
  branch: {
    id: string;
    name: string;
    address: string | null;
    gym: {
      id: string;
      name: string;
      plan: string;
    };
  };
  isLocked?: boolean;
}

export function BranchDetailsClient({ branch, isLocked }: BranchDetailsClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      {isLocked && (
        <div className="mb-8 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30 flex-shrink-0">
                    <Lock className="w-6 h-6 text-rose-400" />
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       Branch Service Suspended
                       <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-[10px] font-black uppercase text-rose-400 border border-rose-500/20">Policy Lock</span>
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed font-medium max-w-xl">
                       This facility has been locked because it exceeds the <span className="text-white/60 font-bold">{branch.gym.plan}</span> plan limit. Biometric operations, including check-ins and agent heartbeats, are currently disabled for this location.
                    </p>
                 </div>
              </div>
              <Link 
                href={`/super-admin/gyms/${branch.gym.id}`}
                className="px-6 py-3 rounded-xl bg-rose-500 text-black text-xs font-black hover:bg-rose-400 transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20"
              >
                 <ArrowRight className="w-4 h-4" />
                 Upgrade to Enterprise
              </Link>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/super-admin/branches" 
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors flex items-center gap-1"
            >
              <GitBranch className="w-3 h-3" />
              Branches
            </Link>
            <span className="text-white/10">/</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Details</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">{branch.name}</h2>
          <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em] mt-0.5">Branch ID: {branch.id}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-white/5 text-white/60 border border-white/10 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <Edit2 className="w-4 h-4" />
            Edit Branch
          </button>
          <button 
            disabled={isLocked}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              isLocked 
                ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed opacity-50' 
                : 'bg-primary text-black hover:shadow-glow'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isLocked ? 'Provisioning Locked' : 'Provision Agent'}
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <EditBranchModal 
          branch={branch} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  );
}

