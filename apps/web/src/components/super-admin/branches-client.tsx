"use client";

import { useState, ReactNode } from "react";
import { Plus } from "lucide-react";
import { AddBranchModal } from "@/components/super-admin/add-branch-modal";

interface BranchesClientProps {
  children: ReactNode;
  gyms: { id: string; name: string }[];
}

export function BranchesClient({ children, gyms }: BranchesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Branches</h2>
           <p className="text-sm text-white/40">Manage branch locations across all gym facilities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Branch
        </button>
      </div>

      {children}

      {isModalOpen && (
        <AddBranchModal 
          onClose={() => setIsModalOpen(false)} 
          gyms={gyms} 
        />
      )}
    </div>
  );
}
