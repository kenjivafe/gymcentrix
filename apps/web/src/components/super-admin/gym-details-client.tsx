"use client";

import { useState } from "react";
import { Edit2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { EditGymModal } from "@/components/super-admin/edit-gym-modal";

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

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/super-admin/gyms" 
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors flex items-center gap-1"
            >
              <LayoutDashboard className="w-3 h-3" />
              Gyms Dashboard
            </Link>
            <span className="text-white/10">/</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Details</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">{gym.name}</h2>
          <p className="text-sm text-white/40 font-medium italic underline decoration-primary/20 underline-offset-4">Cluster ID: {gym.id}</p>
        </div>
        
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-white/5 text-white/60 border border-white/10 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          <Edit2 className="w-4 h-4" />
          Edit Tenant Configuration
        </button>
      </div>

      {isEditModalOpen && (
        <EditGymModal 
          gym={gym} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  );
}
