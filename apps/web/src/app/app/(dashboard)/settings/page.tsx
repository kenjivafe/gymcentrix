import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Settings, Building2, Shield, Bell, Save, CreditCard, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AppSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const gymId = user?.gymId;

  if (!user || user.role !== "GYM_OWNER") {
    redirect("/app");
  }

  const gym = await prisma.gym.findUnique({
    where: { id: gymId },
    include: {
      owner: true,
    }
  });

  if (!gym) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Facility Settings</h2>
           <p className="text-sm text-white/40">Manage your gym's identity, administrative security, and billing cluster.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95">
          <Save className="w-4 h-4" />
          Update Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 group hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                 <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Facility Identity</h4>
                <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                  This identity is visible to all members and staff across your designated branches.
                </p>
              </div>
           </div>
           
           <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                 <CreditCard className="w-16 h-16 text-white" />
              </div>
              <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Active Plan</p>
              <div className="space-y-1">
                 <span className="text-xl font-display font-bold text-white block">Gymcentrix Pro</span>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Next billed April 12, 2026</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
           {/* General Info */}
           <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white/40" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-white">General Information</h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Core metadata for your gym facility.</p>
                 </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Gym Name</label>
                       <input 
                         defaultValue={gym.name}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Owner Contact</label>
                       <input 
                         defaultValue={gym.owner.name || ''}
                         disabled
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white/40 cursor-not-allowed font-medium"
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Security Toggles */}
           <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white/40" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-white">Access & Security</h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Control facility-wide security protocols.</p>
                 </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
                 {[
                   { label: "Guest Access", description: "Allow unregistered RFID tokens to be logged as 'Unknown Guests'.", value: true },
                   { label: "Notification Alerts", description: "Receive instant push alerts for expired membership taps.", value: true },
                   { label: "Manual Override", description: "Allow staff to manually approve check-ins via the dashboard.", value: false },
                 ].map((opt, idx, arr) => (
                   <div key={opt.label} className={`p-6 flex items-center justify-between gap-8 ${idx !== arr.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.01] transition-colors`}>
                      <div className="space-y-1">
                         <p className="text-sm font-bold text-white">{opt.label}</p>
                         <p className="text-xs text-white/40 leading-relaxed font-medium max-w-sm">{opt.description}</p>
                      </div>
                      <button className={`relative w-10 h-5 rounded-full transition-colors ${opt.value ? 'bg-primary' : 'bg-white/10'}`}>
                         <div className={`absolute top-1 w-3 h-3 rounded-full bg-black transition-all ${opt.value ? 'left-6' : 'left-1'}`} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           {/* Subscription Link */}
           <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 border-dashed flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white/20" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Billing & Subscription</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Manage your Gymcentrix license and professional cluster add-ons</p>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white transition-colors" />
           </div>
        </div>
      </div>
    </div>
  );
}
