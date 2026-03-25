import { Settings, Shield, Cpu, Bell, Globe, Database, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PlatformSettingsPage() {
  const settingsSections = [
    {
      title: "Platform Core",
      icon: Globe,
      description: "Manage global platform behavior and visibility.",
      options: [
        { label: "Maintenance Mode", description: "Disable tenant access for scheduled updates.", type: "toggle", value: false },
        { label: "Public Registration", description: "Allow new gyms to apply for registration.", type: "toggle", value: true },
        { label: "Hardware Whitelisting", description: "Require manual approval for all new RFID agents.", type: "toggle", value: true },
      ]
    },
    {
      title: "Security & Auth",
      icon: Shield,
      description: "Control authentication protocols and administrative security.",
      options: [
        { label: "Two-Factor Authentication", description: "Enforce 2FA for all Super Admin accounts.", type: "toggle", value: true },
        { label: "Session Timeout", description: "Automatically logout idle administrative sessions.", type: "select", value: "30 Minutes" },
        { label: "API Key Rotation", description: "Forces hardware agents to refresh keys every 90 days.", type: "toggle", value: false },
      ]
    },
    {
      title: "Data & Systems",
      icon: Database,
      description: "Storage, database, and infrastructure integration settings.",
      options: [
        { label: "Real-time Telemetry", description: "Broadcast hardware heartbeats to the log stream.", type: "toggle", value: true },
        { label: "Data Retention", description: "Duration to keep attendance logs in primary storage.", type: "select", value: "12 Months" },
        { label: "External Backup", description: "Daily cloud synchronization for disaster recovery.", type: "toggle", value: true },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">System Configuration</h2>
           <p className="text-sm text-white/40">Adjust the underlying architecture and behavior of the Gymcentrix platform.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95">
          <Save className="w-4 h-4" />
          Synchronize Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar help */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                 <Settings className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-medium">
                Changes here affect all clusters and tenants globally. Proceed with caution when toggling core infrastructure flags.
              </p>
           </div>
           
           <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Hardware Nodes</p>
              <div className="flex items-center justify-between text-white">
                 <span className="text-xs font-bold">Total Agents</span>
                 <span className="text-lg font-display font-bold">12</span>
              </div>
           </div>
        </div>

        {/* Settings list */}
        <div className="lg:col-span-3 space-y-8">
           {settingsSections.map((section) => (
             <div key={section.title} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <section.icon className="w-4 h-4 text-white/40" />
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-white">{section.title}</h3>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">{section.description}</p>
                   </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
                   {section.options.map((opt, idx) => (
                     <div key={opt.label} className={`p-6 flex items-center justify-between gap-8 ${idx !== section.options.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.01] transition-colors`}>
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-white">{opt.label}</p>
                           <p className="text-xs text-white/40 leading-relaxed font-medium max-w-sm">{opt.description}</p>
                        </div>
                        
                        {opt.type === 'toggle' ? (
                          <button className={`relative w-10 h-5 rounded-full transition-colors ${opt.value ? 'bg-primary' : 'bg-white/10'}`}>
                             <div className={`absolute top-1 w-3 h-3 rounded-full bg-black transition-all ${opt.value ? 'left-6' : 'left-1'}`} />
                          </button>
                        ) : (
                          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 cursor-pointer hover:bg-white/10 transition-colors uppercase tracking-widest">
                             {opt.value}
                          </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
