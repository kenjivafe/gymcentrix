"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, CreditCard, Building2, Calendar, Loader2, ChevronRight } from "lucide-react";
import { registerMember } from "@/lib/actions/member";

interface AddMemberModalProps {
  branches: any[];
  gymId: string;
  onClose: () => void;
}

export function AddMemberModal({ branches, gymId, onClose }: AddMemberModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("1-month");
  const [customDate, setCustomDate] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    let expiryDate: Date | null = null;
    if (duration !== "none") {
      expiryDate = new Date();
      // Set to the very end of today, so 1 month from now ends at 23:59:59
      expiryDate.setHours(23, 59, 59, 999);
      
      if (duration === "1-month") expiryDate.setMonth(expiryDate.getMonth() + 1);
      else if (duration === "3-months") expiryDate.setMonth(expiryDate.getMonth() + 3);
      else if (duration === "6-months") {
        expiryDate.setMonth(expiryDate.getMonth() + 6);
      } else if (duration === "1-year") {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else if (duration === "custom" && customDate) {
        expiryDate = new Date(customDate);
        expiryDate.setHours(23, 59, 59, 999);
      }
    }

    const data = {
      name: formData.get("name") as string,
      gymId: gymId,
      branchId: formData.get("branchId") as string,
      rfidUid: formData.get("rfidUid") as string || null,
      membershipStatus: formData.get("membershipStatus") as any,
      membershipExpiry: expiryDate ? expiryDate.toISOString() : null,
    };

    const result = await registerMember(data);

    if (result.error) {
      setError(typeof result.error === "string" ? result.error : "Validation error");
      setLoading(false);
    } else {
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <UserPlus className="w-32 h-32 text-white" />
         </div>

         <div className="p-8 md:p-12 space-y-8 relative z-10">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <h3 className="text-3xl font-display font-bold text-white tracking-tight">Register Member</h3>
                  <p className="text-sm text-white/40 font-medium tracking-tight">Create a new access profile and assign an RFID token.</p>
               </div>
               <button onClick={onClose} className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-4">
                  <div className="group space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Full Name</label>
                     <div className="relative">
                        <UserPlus className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input name="name" type="text" required placeholder="Member Name" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium" />
                     </div>
                  </div>

                  <div className="group space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Branch Assignment</label>
                     <div className="relative">
                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <select name="branchId" required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none transition-all font-medium">
                           {branches.map(b => <option key={b.id} value={b.id} className="bg-black">{b.name}</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">RFID Token (UID)</label>
                        <div className="relative">
                           <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                           <input name="rfidUid" type="text" placeholder="Scanning..." className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium uppercase font-mono" />
                        </div>
                     </div>
                     <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Membership Duration</label>
                        <div className="relative">
                           <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                           <select 
                             value={duration} 
                             onChange={(e) => setDuration(e.target.value)} 
                             className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none transition-all font-medium"
                           >
                             <option value="none" className="bg-black">No Expiration (Lifetime)</option>
                             <option value="1-month" className="bg-black">1 Month</option>
                             <option value="3-months" className="bg-black">3 Months</option>
                             <option value="6-months" className="bg-black">6 Months</option>
                             <option value="1-year" className="bg-black">1 Year</option>
                             <option value="custom" className="bg-black">Custom Date...</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  
                  {duration === "custom" && (
                    <div className="group space-y-2 animate-in fade-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Custom Expiry Date</label>
                       <div className="relative">
                          <input 
                            type="date" 
                            required 
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium" 
                          />
                       </div>
                    </div>
                  )}

                  <div className="group space-y-2 pt-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Security & Access Status</label>
                     <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl">
                        {(["ACTIVE", "FROZEN", "BANNED"] as const).map((s) => (
                           <label key={s} className="flex-1 cursor-pointer group/label">
                              <input 
                                type="radio" 
                                name="membershipStatus" 
                                value={s} 
                                defaultChecked={s === "ACTIVE"} 
                                className="sr-only peer" 
                              />
                              <div className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all 
                                peer-checked:bg-white/10 peer-checked:text-white text-white/20 hover:text-white/40
                                ${s === 'BANNED' ? 'peer-checked:!bg-rose-500 peer-checked:!text-black' : ''}
                                ${s === 'FROZEN' ? 'peer-checked:!bg-amber-400 peer-checked:!text-black' : ''}
                                ${s === 'ACTIVE' ? 'peer-checked:!bg-emerald-400 peer-checked:!text-black' : ''}
                              `}>
                                 {s}
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>
               </div>

               {error && <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black text-center uppercase tracking-widest">{error}</div>}

               <div className="flex gap-4 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 py-5 rounded-2xl border border-white/5 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-[2] bg-primary hover:shadow-glow-strong active:scale-[0.98] py-5 rounded-2xl text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register Member <ChevronRight className="w-4 h-4" /></>}
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>,
    document.body
  );
}
