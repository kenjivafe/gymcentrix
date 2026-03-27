"use client";

import { useState, useTransition } from "react";
import { Power, AlertTriangle, X } from "lucide-react";
import { setActiveBranch } from "@/lib/actions/gym";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ActivateBranchButtonProps {
  gymId: string;
  branchId: string;
  branchName: string;
  className?: string;
}

export function ActivateBranchButton({ gymId, branchId, branchName, className }: ActivateBranchButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const isConfirmed = confirmText === branchName;

  const handleActivate = () => {
    if (!isConfirmed) return;

    startTransition(async () => {
      const result = await setActiveBranch(gymId, branchId);
      if (result.error) {
        alert(result.error);
      } else {
        setShowModal(false);
        setConfirmText("");
        router.refresh();
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={cn(
          "bg-primary text-black text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-glow-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(182,255,0,0.4)] active:scale-95",
          className
        )}
      >
        <Power className="w-4 h-4" />
        Set as Active
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 cursor-default">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative p-8">
              <button 
                onClick={(e) => {
                   e.stopPropagation();
                   setShowModal(false);
                   setConfirmText("");
                }}
                disabled={isPending}
                className="absolute top-6 right-6 p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-6">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              
              <h3 className="text-xl font-display font-bold text-white mb-2 tracking-tight">Activate Facility</h3>
              <p className="text-xs text-white/40 leading-relaxed font-medium mb-6">
                This action is destructive for your other branches. Upon activation, <strong className="text-white">API access for all other facilities will be immediately suspended</strong> until they are upgraded to the Enterprise tier.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Type to confirm active branch</p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#050505] border border-white/5 select-none text-sm font-bold text-white/60">
                    {branchName}
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Enter branch name..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-white placeholder:text-white/20 text-sm font-medium"
                    disabled={isPending}
                  />
                </div>

                <button
                  onClick={handleActivate}
                  disabled={!isConfirmed || isPending}
                  className="w-full mt-6 bg-rose-500 hover:bg-rose-400 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  <Power className={cn("w-4 h-4", isPending && "animate-pulse")} />
                  {isPending ? "Activating..." : "Confirm Activation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
