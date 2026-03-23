import React from 'react';
import { Check, ArrowRight, Monitor, Laptop, Server, HelpCircle } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    description: "Small gyms, basic features.",
    priceMonthly: "1,500",
    priceAnnual: "16,500",
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
    description: "Growing gyms, full automation.",
    priceMonthly: "3,000",
    priceAnnual: "33,000",
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
    description: "Multi-location gyms, full reporting & integrations.",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
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
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'annually'>('monthly');

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-canvas">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-14 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-4xl font-display font-bold tracking-tighter sm:text-5xl text-white mb-10">
            Pricing
          </h2>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-md">
            <button 
              onClick={() => setBillingPeriod('monthly')}
              className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                billingPeriod === 'monthly' ? 'bg-primary text-canvas shadow-glow' : 'text-white/40 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingPeriod('annually')}
              className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                billingPeriod === 'annually' ? 'bg-primary text-canvas shadow-glow' : 'text-white/40 hover:text-white'
              }`}
            >
              Annual
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                billingPeriod === 'annually' ? 'bg-canvas text-primary' : 'bg-primary/20 text-primary'
              }`}>
                10% off
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`relative flex flex-col p-8 sm:p-10 rounded-[2.5rem] border transition-all duration-500 group ${
                plan.recommend 
                  ? 'bg-white/[0.03] border-primary/30 shadow-glow-strong' 
                  : 'bg-white/[0.01] border-white/5 hover:border-white/10 shadow-sm'
              }`}
            >
              {plan.recommend && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-[10px] font-bold text-canvas uppercase tracking-widest shadow-glow">
                  Recommended
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-display font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed h-12 mb-6">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-sm font-sans text-white/40">₱</span>
                  <span className="text-5xl font-display font-bold text-white tracking-tighter transition-all duration-500">
                    {billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceAnnual}
                  </span>
                  <span className="text-sm font-sans text-white/20 uppercase tracking-widest ml-1">
                    {plan.priceMonthly === 'Custom' ? '' : billingPeriod === 'monthly' ? '/mo' : '/yr'}
                  </span>
                </div>
                {billingPeriod === 'annually' && plan.priceMonthly !== 'Custom' && (
                  <div className="mt-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-1 duration-500">
                    Saves ₱{plan.priceMonthly} annually
                  </div>
                )}
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

              <div className="space-y-4">
                <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center gap-2 group/btn ${
                  plan.recommend 
                    ? 'bg-primary text-canvas hover:bg-white hover:scale-[1.02]' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                }`}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] cursor-pointer hover:text-white/40 transition-colors">
                    or Get a quote
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
