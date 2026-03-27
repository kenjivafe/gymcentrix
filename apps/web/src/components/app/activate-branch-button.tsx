"use client";

import { useTransition } from "react";
import { Activity } from "lucide-react";
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
        "bg-white text-black text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-1.5 disabled:opacity-50",
        className
      )}
    >
      <Activity className={cn("w-3 h-3", isPending && "animate-pulse")} />
      {isPending ? "Activating..." : "Set as Active"}
    </button>
  );
}
