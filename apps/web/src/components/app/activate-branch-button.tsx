"use client";

import { useTransition } from "react";
import { Power } from "lucide-react";
import { setActiveBranch } from "@/lib/actions/gym";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ActivateBranchButtonProps {
  gymId: string;
  branchId: string;
  className?: string;
}

export function ActivateBranchButton({ gymId, branchId, className }: ActivateBranchButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleActivate = () => {
    startTransition(async () => {
      const result = await setActiveBranch(gymId, branchId);
      if (result.error) {
        alert(result.error);
      } else {
        // Force a UI refresh to reflect the new active branch
        router.refresh();
      }
    });
  };

  return (
    <button
      onClick={handleActivate}
      disabled={isPending}
      className={cn(
        "bg-primary text-black text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-glow-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(182,255,0,0.4)] active:scale-95 disabled:opacity-50",
        className
      )}
    >
      <Power className={cn("w-4 h-4", isPending && "animate-pulse")} />
      {isPending ? "Activating..." : "Set as Active"}
    </button>
  );
}
