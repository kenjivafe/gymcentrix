import React from 'react';
import { Check, ArrowRight, Monitor, Laptop, Server, HelpCircle } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    description: "Small or independent gyms starting to digitize operations.",
    features: [
      "Member management",
      "Attendance tracking",
      "Basic dashboard",
      "Up to 100 members",
      "Email support",
    ],
    cta: "Book a call",
    recommend: false,
    icon: Laptop
  },
  {
    name: "Pro",
    description: "Growing gyms that want full automation and RFID precision.",
    features: [
      "RFID attendance tracking",
      "Member management",
      "Payment tracking",
      "Attendance insights and reports",
      "Staff access controls",
      "Higher member limits",
    ],
    cta: "Book a call",
    recommend: true,
    icon: Monitor
  },
  {
    name: "Enterprise",
    description: "Multi-location gyms or large-scale fitness facilities.",
    features: [
      "Multi-location support",
      "Advanced analytics",
      "Full reporting suite",
      "Staff roles and permissions",
      "Priority support",
      "Custom integrations",
    ],
    cta: "Book a call",
    recommend: false,
    icon: Server
  }
];

export function PricingSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-canvas">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-14 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-display font-bold tracking-tighter sm:text-7xl text-white mb-6">
            Flexible Pricing & Setup
          </h2>
          <p className="text-lg sm:text-xl text-white/50 leading-relaxed font-sans">
            Final pricing may vary depending on your gym’s size, setup, and hardware requirements.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`relative flex flex-col p-8 sm:p-10 rounded-[2.5rem] border transition-all duration-500 group ${
                plan.recommend 
                  ? 'bg-white/[0.03] border-primary/30 shadow-glow-strong' 
                  : 'bg-white/[0.01] border-white/5 hover:border-white/10'
              }`}
            >
              {plan.recommend && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-[10px] font-bold text-canvas uppercase tracking-widest">
                  Recommended
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-500 ${
                  plan.recommend ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/5'
                }`}>
                  <plan.icon className={`w-7 h-7 ${plan.recommend ? 'text-primary' : 'text-white/40'}`} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed h-12">
                  {plan.description}
                </p>
              </div>

              <div className="flex-grow space-y-4 mb-10">
                {plan.features.map((feature, featureIdx) => (
                  <div key={featureIdx} className="flex items-start gap-3">
                    <div className={`mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                      plan.recommend ? 'bg-primary/20' : 'bg-white/10'
                    }`}>
                      <Check className={`w-2.5 h-2.5 ${plan.recommend ? 'text-primary' : 'text-white/60'}`} />
                    </div>
                    <span className="text-sm text-white/60 font-sans leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center gap-2 group/btn ${
                plan.recommend 
                  ? 'bg-primary text-canvas hover:bg-white hover:scale-[1.02]' 
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
              }`}>
                {plan.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
