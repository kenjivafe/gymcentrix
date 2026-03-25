"use client";

import { useState } from "react";
import { X, Loader2, Building2, MapPin, GitBranch } from "lucide-react";
import { registerBranch } from "@/lib/actions/branch";

interface AddBranchModalProps {
  onClose: () => void;
  gyms: { id: string; name: string }[];
}

export function AddBranchModal({ onClose, gyms }: AddBranchModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      gymId: formData.get("gymId") as string,
    };

    const result = await registerBranch(data);

    if (result.error) {
      if (typeof result.error === "string") {
        setError(result.error);
      } else {
        setFieldErrors(result.error);
      }
      setIsPending(false);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative p-8">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white tracking-tight">Add New Branch</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest font-black mt-1">Branch Facility Deployment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Gym Entity</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <select
                    name="gymId"
                    required
                    defaultValue=""
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-[#0A0A0A]">Select a Parent Gym</option>
                    {gyms.map((gym) => (
                      <option key={gym.id} value={gym.id} className="bg-[#0A0A0A]">
                        {gym.name}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.gymId && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.gymId[0]}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Branch Name</label>
                <div className="relative group">
                  <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <input
                    name="name"
                    required
                    placeholder="e.g. Downtown Center"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium"
                  />
                </div>
                {fieldErrors.name && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.name[0]}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Location Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <textarea
                    name="address"
                    required
                    rows={3}
                    placeholder="Physical address of the facility..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                  />
                </div>
                {fieldErrors.address && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.address[0]}</p>}
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-400/10 border border-rose-400/20 text-rose-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[2] py-3 px-4 rounded-xl text-xs font-black bg-primary text-black hover:shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Deploy Branch Cluster"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
