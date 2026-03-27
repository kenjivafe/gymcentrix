"use client";

import { useTransition } from "react";
import { Power } from "lucide-react";
import { setActiveBranch } from "@/lib/actions/gym";
import { cn } from "@/lib/utils";

interface ActivateBranchButtonProps {
  gymId: string;
  branchId: string;
  className?: string;
}

export function ActivateBranchButton({ gymId, branchId, className }: ActivateBranchButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleActivate = () => {
    startTransition(async () => {
      const result = await setActiveBranch(gymId, branchId);
      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleActivate}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100",
        className
      )}
    >
      <Power className={cn("w-3.5 h-3.5", isPending && "animate-pulse")} />
      {isPending ? "Activating..." : "Activate Facility"}
    </button>
  );
}
