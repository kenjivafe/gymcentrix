import { CreditCard, Plus, Check, ChevronRight, Zap, Target, Rocket } from "lucide-react";

export default function MembershipPlansPage() {
  const plans = [
    {
      name: "Lite",
      price: "$49",
      description: "For small boutiques and independent studios.",
      features: ["Up to 100 Members", "1 Branch Support", "Basic Analytics", "RFID Integration"],
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      name: "Pro",
      price: "$149",
      description: "Ideal for growing gyms with multiple locations.",
      features: ["Unlimited Members", "5 Branch Support", "Advanced Analytics", "Hardware Monitoring", "Staff Management"],
      icon: Zap,
      color: "text-primary",
      bg: "bg-primary/10",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Full-scale solution for national gym chains.",
      features: ["Multiple Organizations", "Unlimited Everything", "White-label Support", "API Access", "Dedicated Account Manager"],
      icon: Rocket,
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Membership Plans</h2>
           <p className="text-sm text-white/40">Configure and manage platform-level subscription tiers for gym tenants.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col hover:border-white/10 transition-all group overflow-hidden ${plan.popular ? 'border-primary/20 shadow-glow-sm' : ''}`}>
             {plan.popular && (
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                   Most Popular
                </div>
             )}
             
             <div className={`w-12 h-12 rounded-2xl ${plan.bg} flex items-center justify-center mb-6`}>
                <plan.icon className={`w-6 h-6 ${plan.color}`} />
             </div>

             <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-display font-black text-white">{plan.price}</span>
                   {plan.price !== 'Custom' && <span className="text-white/40 text-xs font-bold uppercase tracking-wider">/mo</span>}
                </div>
                <p className="text-sm text-white/40 mt-4 leading-relaxed">{plan.description}</p>
             </div>

             <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                   <div key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/10 flex items-center justify-center shrink-0 border border-emerald-400/20">
                         <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-xs text-white/60 font-medium">{feature}</span>
                   </div>
                ))}
             </div>

             <button className={`w-full py-3 rounded-xl text-xs font-bold border transition-all ${
                plan.popular 
                  ? 'bg-primary text-black hover:bg-white border-transparent' 
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
             }`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Edit Plan Configuration'}
             </button>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 border-dashed flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
               <CreditCard className="w-5 h-5 text-white/20" />
            </div>
            <div>
               <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Global Pricing Configuration</p>
               <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Adjust currency, tax rates, and billing cycles</p>
            </div>
         </div>
         <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}
