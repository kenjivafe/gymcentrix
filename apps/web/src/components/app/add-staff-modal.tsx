"use client";

import { useState } from "react";
import { X, User2, Mail, Loader2, ShieldCheck, ChevronRight } from "lucide-react";
import { registerStaff } from "@/lib/actions/user";

interface AddStaffModalProps {
  onClose: () => void;
}

export function AddStaffModal({ onClose }: AddStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        setError("Invalid input data. Please check your fields.");
      }
      setLoading(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <User2 className="w-32 h-32 text-white" />
        </div>

        <div className="p-8 md:p-12 space-y-8 relative z-10">
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <h3 className="text-3xl font-display font-bold text-white tracking-tight">Add Staff Member</h3>
                 <p className="text-sm text-white/40 font-medium tracking-tight">Register a new employee to your facility portal.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                 <div className="group space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Full Name</label>
                    <div className="relative">
                       <User2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                       <input 
                         name="name"
                         type="text" 
                         required
                         placeholder="John Doe"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium" 
                       />
                    </div>
                 </div>

                 <div className="group space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                       <input 
                         name="email"
                         type="email" 
                         required
                         placeholder="staff@gymcentrix.com"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium" 
                       />
                    </div>
                 </div>

                 <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                       <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">Employee Role</p>
                       <p className="text-xs text-white/60 font-medium">Standard facility access provided.</p>
                    </div>
                 </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black text-center uppercase tracking-widest animate-in shake">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                 <button 
                   type="button"
                   onClick={onClose}
                   className="flex-1 py-5 rounded-2xl border border-white/5 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="flex-[2] bg-primary hover:shadow-glow-strong active:scale-[0.98] py-5 rounded-2xl text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                     <>
                       Register Staff
                       <ChevronRight className="w-4 h-4" />
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
