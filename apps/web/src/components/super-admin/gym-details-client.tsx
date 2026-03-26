"use client";

import { useState } from "react";
import { Building2, Edit2, Plus } from "lucide-react";
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
  };
}

export function GymDetailsClient({ gym }: GymDetailsClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);

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
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">{gym.name}</h2>
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
          <button 
            onClick={() => setIsAddBranchModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-primary text-black hover:shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Branch
          </button>
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
