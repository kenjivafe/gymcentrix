"use client";

import { useState } from "react";
import { X, Loader2, Building2, User2, Mail, ShieldCheck } from "lucide-react";
import { registerGym } from "@/lib/actions/gym";

export function AddGymModal({ onClose }: { onClose: () => void }) {
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
      ownerName: formData.get("ownerName") as string,
      ownerEmail: formData.get("ownerEmail") as string,
    };

    const result = await registerGym(data);

    if (result.error) {
      if (typeof result.error === "string") {
        setError(result.error);
      } else {
        setFieldErrors(result.error as Record<string, string[]>);
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
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white tracking-tight">Register New Gym</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">Tenant Infrastructure Provisioning</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Gym Facility Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <input
                    name="name"
                    required
                    placeholder="e.g. Metabolic Fitness Center"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium"
                  />
                </div>
                {fieldErrors.name && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.name[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Primary Owner</label>
                  <div className="relative group">
                    <User2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                      name="ownerName"
                      required
                      placeholder="Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  {fieldErrors.ownerName && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.ownerName[0]}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Identity & Auth</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                      name="ownerEmail"
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  {fieldErrors.ownerEmail && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.ownerEmail[0]}</p>}
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
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Authorize & Register
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
