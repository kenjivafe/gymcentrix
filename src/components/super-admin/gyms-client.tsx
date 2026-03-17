"use client";

import { useState, ReactNode } from "react";
import { Plus } from "lucide-react";
import { AddGymModal } from "@/components/super-admin/add-gym-modal";

export function GymsClient({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-widest text-primary/80 font-bold">Tenant Management</p>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Registered Gyms
          </h2>
          <p className="text-lg text-white/60">
            Manage your tenant gyms and monitor their registration status.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="whitespace-nowrap flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          <Plus className="size-5" />
          Register New Gym
        </button>
      </div>

      {children}

      {isModalOpen && <AddGymModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
