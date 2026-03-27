"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Building2, User2, Mail, Save } from "lucide-react";
import { updateGym } from "@/lib/actions/gym";

interface EditGymModalProps {
  gym: {
    id: string;
    name: string;
    owner: {
      name: string;
      email: string;
    };
    plan: "BASIC" | "PRO" | "ENTERPRISE";
  };
  onClose: () => void;
}

export function EditGymModal({ gym, onClose }: EditGymModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      id: gym.id,
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      ownerEmail: formData.get("ownerEmail") as string,
      plan: formData.get("plan") as any,
    };

    const result = await updateGym(data);

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

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
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
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white tracking-tight">Edit Gym Facility</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">Tenant Meta Configuration</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Facility Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <input
                    name="name"
                    defaultValue={gym.name}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                  />
                </div>
                {fieldErrors.name && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.name[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Owner Name</label>
                  <div className="relative group">
                    <User2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                      name="ownerName"
                      defaultValue={gym.owner.name}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  {fieldErrors.ownerName && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.ownerName[0]}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Owner Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                      name="ownerEmail"
                      defaultValue={gym.owner.email}
                      required
                      type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  {fieldErrors.ownerEmail && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.ownerEmail[0]}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Subscription Plan</label>
                <div className="grid grid-cols-3 gap-3">
                  {["BASIC", "PRO", "ENTERPRISE"].map((p) => (
                    <label key={p} className="relative cursor-pointer group">
                      <input
                        type="radio"
                        name="plan"
                        value={p}
                        defaultChecked={gym.plan === p}
                        className="peer sr-only"
                      />
                      <div className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-white/5 border border-white/10 peer-checked:bg-primary/10 peer-checked:border-primary/40 group-hover:bg-white/10 transition-all">
                        <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${
                          p === "BASIC" ? "text-slate-400" : p === "PRO" ? "text-primary" : "text-violet-400"
                        }`}>
                          {p}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
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
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Commit Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
