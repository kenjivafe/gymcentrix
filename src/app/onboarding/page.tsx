'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Building2, 
  MapPin, 
  Users, 
  UserPlus,
  Monitor,
  Tablet,
  Wifi,
  Cpu,
  Settings,
  Target,
  Zap,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Form Steps
const steps = [
  { id: 'contact-info', title: 'Contact Info' },
  { id: 'gym-type', title: 'Gym Type' },
  { id: 'gym-info', title: 'Gym Info' },
  { id: 'tech-setup', title: 'Tech Setup' },
  { id: 'internet-check', title: 'Internet' },
  { id: 'rfid-hardware', title: 'Hardware' },
  { id: 'attendance', title: 'Attendance' },
  { id: 'goals', title: 'Goals' },
  { id: 'plan-selection', title: 'Plan' },
  { id: 'estimation', title: 'Estimation' },
  { id: 'schedule', title: 'Schedule' },
];

const plans = [
  {
    name: 'Starter',
    basePrice: 1500,
    description: 'Perfect for small gyms & startups.',
    features: ['Up to 100 members', 'Basic attendance', 'Email support']
  },
  {
    name: 'Pro',
    basePrice: 3000,
    description: 'The standard for growing gyms.',
    features: ['RFID tracking', 'Advanced insights', 'Staff controls']
  },
  {
    name: 'Enterprise',
    basePrice: 5000,
    description: 'For multi-location & large scale.',
    features: ['Multi-branch sync', 'API access', 'Priority support']
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gymType: '' as 'Independent' | 'Multi-branch' | '',
    gymName: '',
    location: '',
    activeMembers: '',
    staffCount: '',
    brandName: '',
    branchCount: '',
    branchLocations: '',
    totalMembers: '',
    totalStaff: '',
    currentSoftware: '',
    hasSoftware: null as boolean | null,
    hasDevice: null as boolean | null,
    os: '',
    stableInternet: null as boolean | null,
    internetSpeed: '',
    hasRFID: null as boolean | null,
    rfidModel: '',
    trackingType: 'automatic', // automatic or manual
    specialRestrictions: '',
    mainProblem: '',
    essentialFeatures: '',
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const recommendation = useMemo(() => {
    const isMulti = formData.gymType === 'Multi-branch';
    const membersStr = isMulti ? formData.totalMembers : formData.activeMembers;
    const members = parseInt(membersStr) || 0;
    const branches = isMulti ? (parseInt(formData.branchCount) || 1) : 1;

    // Enterprise: Multi-branch or High Volume
    if (isMulti || branches > 1 || members > 1000) {
      return 'Enterprise';
    }

    // Pro: Large Independent or RFID needed (any automatic tracking or existing hardware)
    if (members > 200 || formData.trackingType === 'automatic' || formData.hasRFID === true) {
      return 'Pro';
    }

    return 'Starter';
  }, [formData]);

  useEffect(() => {
    if (!selectedPlanName && currentStep >= 8) {
      setSelectedPlanName(recommendation);
    }
  }, [recommendation, selectedPlanName, currentStep]);

  const estimate = useMemo(() => {
    let setup = 0;
    let monthly = 0;
    const setupItems: { label: string; price: number }[] = [];
    const monthlyItems: { label: string; price: number }[] = [];

    const selectedPlan = plans.find(p => p.name === selectedPlanName) || plans[0];
    const isMulti = formData.gymType === 'Multi-branch';
    const branches = isMulti ? (parseInt(formData.branchCount) || 1) : 1;
    const membersStr = isMulti ? formData.totalMembers : formData.activeMembers;
    const members = parseInt(membersStr) || 0;

    // 1. Monthly Recurring
    monthly = selectedPlan.basePrice;
    monthlyItems.push({ label: `${selectedPlan.name} Plan (Base)`, price: selectedPlan.basePrice });

    // Branch Monthly Surcharge (for branches beyond the first)
    if (branches > 1) {
      const extraBranchPrice = (branches - 1) * 2000;
      monthly += extraBranchPrice;
      monthlyItems.push({ label: `Additional Branches (${branches - 1})`, price: extraBranchPrice });
    }

    // Member Volume Surcharge
    if (members > 2000) {
      monthly += 1500;
      monthlyItems.push({ label: 'High Member Volume (>2k)', price: 1500 });
    } else if (members > 500) {
      monthly += 500;
      monthlyItems.push({ label: 'Mid-Tier Member Volume (>500)', price: 500 });
    }

    // 2. One-time Setup
    // Base Setup: ₱10,000 per branch
    const baseSetup = branches * 10000;
    setup += baseSetup;
    setupItems.push({ label: `System Setup (${branches} Location${branches > 1 ? 's' : ''})`, price: baseSetup });

    // Hardware Adjustment (RFID Reader)
    if (formData.hasRFID === false) {
      const rfidHardwarePrice = branches * 7500;
      setup += rfidHardwarePrice;
      setupItems.push({ label: `RFID Reader Hardware (${branches} Units)`, price: rfidHardwarePrice });
    }

    // Hardware Adjustment (Device/PC)
    if (formData.hasDevice === false) {
      const devicePrice = branches * 20000;
      setup += devicePrice;
      setupItems.push({ label: `Dedicated Device Setup (${branches} Units)`, price: devicePrice });
    }

    // RFID Cards (3x current members @ ₱20 Each)
    if (members > 0) {
      const cardCount = members * 3;
      const cardsPrice = cardCount * 20;
      setup += cardsPrice;
      setupItems.push({ label: `RFID Cards (Initial Stock - ${cardCount} Units)`, price: cardsPrice });
    }

    return { setup, monthly, setupItems, monthlyItems };
  }, [formData, selectedPlanName]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-canvas selection:bg-primary selection:text-canvas overflow-x-hidden relative">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      {/* Navbar / Logo Area */}
      <nav className="relative z-50 px-6 py-8 sm:px-14 flex justify-between items-center">
        <Link href="/" className="group">
          <Image 
            src="/app/gymcentrix-logo.png" 
            alt="Gymcentrix Logo" 
            width={180} 
            height={40} 
            className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <Link 
          href="/" 
          className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
        >
          Cancel
        </Link>
      </nav>

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 lg:px-14 mt-8 sm:mt-16">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary shadow-glow transition-all duration-700 ease-out" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="min-h-[400px]">
          {currentStep === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Contact Info</h2>
                <p className="text-white/40 text-sm">Let&apos;s start with how we can reach you.</p>
              </div>
              <div className="grid gap-6">
                <InputGroup 
                  label="Full Name" 
                  icon={Users} 
                  placeholder="e.g. Juan Dela Cruz"
                  value={formData.fullName}
                  onChange={(val: string) => updateFormData('fullName', val)}
                />
                <InputGroup 
                  label="Email Address" 
                  subLabel="Required"
                  icon={MapPin} 
                  placeholder="e.g. juan@gym.com"
                  value={formData.email}
                  onChange={(val: string) => updateFormData('email', val)}
                />
                <InputGroup 
                  label="Phone Number" 
                  subLabel="Optional"
                  icon={Tablet} 
                  placeholder="e.g. 0917 123 4567"
                  value={formData.phone}
                  onChange={(val: string) => updateFormData('phone', val)}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Gym Type</h2>
                <p className="text-white/40 text-sm">Select the category that best describes your gym.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(['Independent', 'Multi-branch'] as const).map(type => (
                  <ActionButton 
                    key={type}
                    active={formData.gymType === type} 
                    onClick={() => updateFormData('gymType', type)}
                    label={type}
                    description={
                      type === 'Independent' ? 'Single location, owner-operated.' :
                      'Multiple locations under one brand.'
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Gym Info</h2>
                <p className="text-white/40 text-sm">Tell us about your {formData.gymType === 'Multi-branch' ? 'brand' : 'gym'}.</p>
              </div>
              
              {formData.gymType === 'Multi-branch' ? (
                <div className="grid gap-6">
                  <InputGroup 
                    label="Main Brand Name" 
                    icon={Building2} 
                    placeholder="e.g. Gold's Gym"
                    value={formData.brandName}
                    onChange={(val: string) => updateFormData('brandName', val)}
                  />
                  <InputGroup 
                    label="Number of Branches" 
                    icon={Target} 
                    placeholder="e.g. 5"
                    type="number"
                    value={formData.branchCount}
                    onChange={(val: string) => updateFormData('branchCount', val)}
                  />
                  <InputGroup 
                    label="Locations of branches (optional)" 
                    icon={MapPin} 
                    placeholder="e.g. Makati, BGC, Alabang"
                    value={formData.branchLocations}
                    onChange={(val: string) => updateFormData('branchLocations', val)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputGroup 
                      label="Total active members across all branches" 
                      icon={Users} 
                      placeholder="e.g. 2500"
                      type="number"
                      value={formData.totalMembers}
                      onChange={(val: string) => updateFormData('totalMembers', val)}
                    />
                    <InputGroup 
                      label="Total staff/admin users" 
                      icon={UserPlus} 
                      placeholder="e.g. 50"
                      type="number"
                      value={formData.totalStaff}
                      onChange={(val: string) => updateFormData('totalStaff', val)}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  <InputGroup 
                    label="What is your gym's name?" 
                    icon={Building2} 
                    placeholder="e.g. Iron Paradise"
                    value={formData.gymName}
                    onChange={(val: string) => updateFormData('gymName', val)}
                  />
                  <InputGroup 
                    label="Where is your gym located?" 
                    icon={MapPin} 
                    placeholder="e.g. BGC, Taguig"
                    value={formData.location}
                    onChange={(val: string) => updateFormData('location', val)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputGroup 
                      label="Active members" 
                      icon={Users} 
                      placeholder="e.g. 500"
                      type="number"
                      value={formData.activeMembers}
                      onChange={(val: string) => updateFormData('activeMembers', val)}
                    />
                    <InputGroup 
                      label="Staff/Admin users" 
                      icon={UserPlus} 
                      placeholder="e.g. 10"
                      type="number"
                      value={formData.staffCount}
                      onChange={(val: string) => updateFormData('staffCount', val)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Tech Setup</h2>
                <p className="text-white/40 text-sm">Understanding your current technology infrastructure.</p>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-sm font-bold text-white uppercase tracking-wider block">Are you currently using any gym management software?</span>
                  <div className="grid grid-cols-2 gap-4">
                    <ToggleButton 
                      active={formData.hasSoftware === true} 
                      onClick={() => updateFormData('hasSoftware', true)}
                      label="Yes"
                    />
                    <ToggleButton 
                      active={formData.hasSoftware === false} 
                      onClick={() => updateFormData('hasSoftware', false)}
                      label="No"
                    />
                  </div>
                  {formData.hasSoftware && (
                    <InputGroup 
                      label="Which software are you using?" 
                      icon={Monitor} 
                      placeholder="e.g. Mindbody, Glofox"
                      value={formData.currentSoftware}
                      onChange={(val: string) => updateFormData('currentSoftware', val)}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <span className="text-sm font-bold text-white uppercase tracking-wider block">Do you have a PC or tablet at the front desk?</span>
                  <div className="grid grid-cols-2 gap-4">
                    <ToggleButton 
                      active={formData.hasDevice === true} 
                      onClick={() => updateFormData('hasDevice', true)}
                      label="Yes"
                    />
                    <ToggleButton 
                      active={formData.hasDevice === false} 
                      onClick={() => updateFormData('hasDevice', false)}
                      label="No"
                    />
                  </div>
                </div>

                {formData.hasDevice && (
                  <div className="space-y-4">
                    <span className="text-sm font-bold text-white uppercase tracking-wider block">Which operating system does it use?</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['Windows', 'macOS', 'Linux', 'Other'].map(os => (
                        <ToggleButton 
                          key={os}
                          active={formData.os === os} 
                          onClick={() => updateFormData('os', os)}
                          label={os}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Internet Check</h2>
                <p className="text-white/40 text-sm">Reliable attendance tracking needs a stable connection.</p>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-sm font-bold text-white uppercase tracking-wider block">Do you have stable internet at the front desk?</span>
                  <div className="grid grid-cols-2 gap-4">
                    <ToggleButton 
                      active={formData.stableInternet === true} 
                      onClick={() => updateFormData('stableInternet', true)}
                      label="Yes"
                    />
                    <ToggleButton 
                      active={formData.stableInternet === false} 
                      onClick={() => updateFormData('stableInternet', false)}
                      label="No"
                    />
                  </div>
                </div>
                <InputGroup 
                  label="Approximate connection speed (Optional)" 
                  icon={Wifi} 
                  placeholder="e.g. 50 Mbps"
                  value={formData.internetSpeed}
                  onChange={(val: string) => updateFormData('internetSpeed', val)}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Hardware</h2>
                <p className="text-white/40 text-sm">RFID / Attendance hardware status.</p>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-sm font-bold text-white uppercase tracking-wider block">Do you already have RFID hardware installed?</span>
                  <div className="grid grid-cols-2 gap-4">
                    <ToggleButton 
                      active={formData.hasRFID === true} 
                      onClick={() => updateFormData('hasRFID', true)}
                      label="Yes"
                    />
                    <ToggleButton 
                      active={formData.hasRFID === false} 
                      onClick={() => updateFormData('hasRFID', false)}
                      label="No"
                    />
                  </div>
                  {formData.hasRFID && (
                    <InputGroup 
                      label="What brand/model is it?" 
                      icon={Cpu} 
                      placeholder="e.g. HID Global, ZKTeco"
                      value={formData.rfidModel}
                      onChange={(val: string) => updateFormData('rfidModel', val)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Attendance Handling</h2>
                <p className="text-white/40 text-sm">How would you like to handle your memberships?</p>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-sm font-bold text-white uppercase tracking-wider block">How do you want to track attendance?</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ActionButton 
                      active={formData.trackingType === 'automatic'} 
                      onClick={() => updateFormData('trackingType', 'automatic')}
                      label="Automatically via RFID"
                      description="Zero friction for staff and members."
                    />
                    <ActionButton 
                      active={formData.trackingType === 'manual'} 
                      onClick={() => updateFormData('trackingType', 'manual')}
                      label="Manually via Tablet/PC"
                      description="Staff clicks to check-in members."
                    />
                  </div>
                </div>
                <InputGroup 
                  label="Special membership tiers or restrictions?" 
                  subLabel="Anything unique we should know about?"
                  icon={Settings} 
                  placeholder="e.g. VIP only access, time-based passes"
                  textArea
                  value={formData.specialRestrictions}
                  onChange={(val: string) => updateFormData('specialRestrictions', val)}
                />
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Goals & Expectations</h2>
                <p className="text-white/40 text-sm">Help us understand how we can best serve you.</p>
              </div>
              <div className="space-y-6">
                <InputGroup 
                  label="What&apos;s the main problem you want Gymcentrix to solve?" 
                  icon={Target} 
                  placeholder="e.g. Reducing manual logbooks, preventing membership sharing"
                  textArea
                  value={formData.mainProblem}
                  onChange={(val) => updateFormData('mainProblem', val)}
                />
                <InputGroup 
                  label="Any essential features for Day 1?" 
                  icon={Check} 
                  placeholder="e.g. SMS alerts, detailed usage reports"
                  textArea
                  value={formData.essentialFeatures}
                  onChange={(val) => updateFormData('essentialFeatures', val)}
                />
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Choose Your Plan</h2>
                <p className="text-white/40 text-sm">We&apos;ve recommended a plan based on your gym profile.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((p) => (
                  <PlanCard 
                    key={p.name}
                    name={p.name}
                    price={p.basePrice}
                    description={p.description}
                    features={p.features}
                    recommended={p.name === recommendation}
                    selected={selectedPlanName === p.name}
                    onClick={() => setSelectedPlanName(p.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Your Estimate</h2>
                <p className="text-white/40 text-sm">Final cost breakdown for {selectedPlanName} plan.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition duration-500">
                    <Zap className="size-16" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">One-time Setup</span>
                    <div className="text-4xl font-display font-bold text-white tracking-tighter">
                      {formatPrice(estimate.setup)}
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-primary/20 shadow-glow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition duration-500">
                    <Zap className="size-16" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Monthly Recurring</span>
                    <div className="text-4xl font-display font-bold text-white tracking-tighter">
                      {formatPrice(estimate.monthly)}<span className="text-sm font-sans text-white/20 ml-1">/mo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:text-white transition-colors group"
                >
                  {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showBreakdown ? 'Hide Breakdown' : 'View Breakdown'}
                </button>

                <AnimatePresence>
                  {showBreakdown && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6"
                    >
                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Setup Breakdown</h4>
                          {estimate.setupItems.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-xs text-white/60">{item.label}</span>
                              <span className="text-xs font-bold text-white">{formatPrice(item.price)}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                            <span className="text-xs font-bold text-white">Total Setup</span>
                            <span className="text-xs font-bold text-primary">{formatPrice(estimate.setup)}</span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4">
                          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Monthly Breakdown</h4>
                          {estimate.monthlyItems.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-xs text-white/60">{item.label}</span>
                              <span className="text-xs font-bold text-white">{formatPrice(item.price)}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                            <span className="text-xs font-bold text-white">Total Monthly</span>
                            <span className="text-xs font-bold text-primary">{formatPrice(estimate.monthly)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">Transparency Guarantee</p>
                  <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                    These costs are calculated based on your specific requirements. We don&apos;t believe in hidden fees or surprises.
                  </p>
                </div>
              </div>

              <div className="pt-4 text-left">
                <p className="text-sm text-primary italic font-medium">
                  Ready to lock this in? Schedule your discovery call below.
                </p>
              </div>
            </div>
          )}

          {currentStep === 10 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-2 mb-8">
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Schedule Your Onboarding</h2>
                <p className="text-white/60">
                  Pick a time that works for you. We&apos;ll walk you through the platform and your questions.
                </p>
              </div>
              
              <div className="w-full h-[600px] border border-white/5 rounded-[2.5rem] bg-white/[0.01] overflow-hidden backdrop-blur-md">
                <iframe 
                  src={`https://calendly.com/kenjivafe?name=${encodeURIComponent(formData.fullName)}&email=${encodeURIComponent(formData.email)}`} 
                  width="100%" 
                  height="100%" 
                  frameBorder="0"
                />
              </div>

              <div className="pt-8 text-left text-sm text-primary italic font-medium">
                <p>
                  Thanks! Once you schedule your call, we&apos;ll be ready to get your gym set up for seamless attendance tracking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-16 flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
              currentStep === 0 
                ? 'opacity-0 pointer-events-none' 
                : 'text-white/40 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-10 py-4 bg-primary text-canvas rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] hover:bg-white transition-all duration-300 shadow-glow"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === steps.length - 1 && (
            <Link
              href="/"
              className="flex items-center gap-2 px-10 py-4 bg-white/5 text-white/60 hover:text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300 border border-white/5 hover:border-white/10"
            >
              Done & Finish
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

// Sub-components
interface PlanCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
  selected?: boolean;
  onClick: () => void;
}

function PlanCard({ name, price, description, features, recommended, selected, onClick }: PlanCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-[2rem] border text-left transition-all duration-500 group flex flex-col h-full bg-white/[0.01] ${
        selected 
          ? 'border-primary/50 shadow-glow bg-white/[0.03]' 
          : 'border-white/5 hover:bg-white/[0.02] hover:border-white/10'
      }`}
    >
      {recommended && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-primary rounded-full text-[8px] font-bold text-canvas uppercase tracking-widest shadow-glow flex items-center gap-1">
          <Star className="w-2 h-2 fill-canvas" />
          Recommended
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-display font-bold text-white mb-1">{name}</h3>
        <div className="text-2xl font-display font-bold text-primary">
          ₱{price.toLocaleString()}<span className="text-[10px] text-white/20 font-sans ml-1">/mo</span>
        </div>
      </div>
      
      <p className="text-[10px] text-white/40 mb-6 leading-relaxed font-sans">{description}</p>
      
      <div className="space-y-2 mt-auto">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Check className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-white/60 font-medium">{f}</span>
          </div>
        ))}
      </div>

      <div className={`mt-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        selected ? 'bg-primary text-canvas' : 'bg-white/5 text-white/20 group-hover:bg-primary/20 group-hover:text-primary'
      }`}>
        <Check className="w-4 h-4" />
      </div>
    </button>
  );
}

interface InputGroupProps {
  label: string;
  subLabel?: string;
  icon: React.ElementType;
  placeholder: string;
  type?: string;
  textArea?: boolean;
  value: string;
  onChange: (val: string) => void;
}

function InputGroup({ 
  label, 
  subLabel, 
  icon: Icon, 
  placeholder, 
  type = 'text', 
  textArea = false,
  value,
  onChange
}: InputGroupProps) {
  return (
    <div className="space-y-3 group">
      <div className="flex flex-col">
        <label className="text-xs font-bold text-white/60 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">
          {label}
        </label>
        {subLabel && (
          <span className="text-[10px] text-white/30 font-medium">{subLabel}</span>
        )}
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        {textArea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-12 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all min-h-[120px] resize-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-12 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all"
          />
        )}
      </div>
    </div>
  );
}

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function ToggleButton({ active, onClick, label }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 border ${
        active 
          ? 'bg-primary text-canvas border-primary shadow-glow' 
          : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:border-white/10'
      }`}
    >
      {label}
    </button>
  );
}

interface ActionButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  description: string;
}

function ActionButton({ active, onClick, label, description }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-6 rounded-3xl text-left transition-all duration-500 border group ${
        active 
          ? 'bg-primary text-canvas border-primary shadow-glow' 
          : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 transition-colors ${
        active ? 'bg-canvas/20' : 'bg-white/5 group-hover:bg-primary/20'
      }`}>
        <Check className={`w-4 h-4 ${active ? 'text-canvas' : 'text-white/20 group-hover:text-primary'}`} />
      </div>
      <div className="font-bold text-xs uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-[10px] font-medium transition-colors ${
        active ? 'text-canvas/60' : 'text-white/30'
      }`}>
        {description}
      </div>
    </button>
  );
}
