"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, UserPlus, Mail, User, Save } from "lucide-react";
import { registerStaff } from "@/lib/actions/user";

interface AddStaffModalProps {
  onClose: () => void;
}

export function AddStaffModal({ onClose }: AddStaffModalProps) {
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
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    const result = await registerStaff(data);

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
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative p-8">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white tracking-tight">Add Staff Member</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black mt-1">Invite employee to management portal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Staff Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <input
                    name="name"
                    placeholder="E.g. Coach Kenji"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-white/10"
                  />
                </div>
                {fieldErrors.name && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.name[0]}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="kenji@gym.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-white/10"
                  />
                </div>
                {fieldErrors.email && <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">{fieldErrors.email[0]}</p>}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em] mb-1">Privilege Note</p>
               <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                 New staff members will have read/write access to members and attendance, but cannot manage other staff or gym billing.
               </p>
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
                className="flex-1 py-3.5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[2] py-3.5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-primary text-black hover:shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Register Staff
                  </>
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
