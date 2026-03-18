"use client";

import { useState } from "react";

import { ArrowUpRight } from "lucide-react";
import {
  membershipPlans,
  type RegistrationFormData,
} from "@/lib/registration";

const faqs = [
  {
    question: "What happens after I submit?",
    answer:
      "A membership specialist will reach out within one business day to finalize billing, schedule onboarding, and issue your RFID card.",
  },
  {
    question: "Do I have to choose personal training now?",
    answer:
      "No. You can enroll for membership alone and add training later. This form simply helps us match you sooner if you opt in now.",
  },
  {
    question: "Is my data secure?",
    answer:
      "All submissions are transmitted over HTTPS and reviewed only by our membership and trainer teams.",
  },
];

const initialFormState: RegistrationFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  goals: "",
  membershipPlan: membershipPlans[0].id,
  addTraining: false,
  trainingFocus: "",
  trainerPreference: "",
  availability: "",
  consentPolicies: false,
  consentComms: true,
  honeypot: "",
};

type FormErrors = Partial<Record<keyof RegistrationFormData | "form", string>>;

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function RegistrationExperience() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionState>("idle");

  function updateField<K extends keyof RegistrationFormData>(key: K, value: RegistrationFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleTraining(value: boolean) {
    updateField("addTraining", value);
    if (!value) {
      setFormData((prev) => ({
        ...prev,
        trainingFocus: "",
        trainerPreference: "",
        availability: "",
      }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(result?.errors ?? { form: "Something went wrong. Please try again." });
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData(initialFormState);
    } catch (error) {
      console.error("registration submit error", error);
      setErrors({ form: "Network error. Please retry." });
      setStatus("error");
    }
  }

  return (
    <div className="space-y-16 pb-24">
      <section className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 lg:p-16 shadow-glow backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <p className="text-xs uppercase tracking-[0.4em] text-primary font-bold">Join the movement</p>
        <h1 className="mt-6 text-5xl font-display font-bold tracking-tighter text-white sm:text-7xl">
          Membership <br /><span className="text-primary italic">Registration.</span>
        </h1>
        <p className="mt-6 text-xl text-white/40 max-w-2xl font-sans leading-relaxed">
          Tell us about your goals, choose a membership tier, and optionally reserve a personal training slot.
          Our team will review and follow up within one business day.
        </p>
        <div className="mt-10 flex flex-wrap gap-6 text-xs text-white/30 uppercase tracking-[0.2em] font-bold">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary shadow-glow" aria-hidden /> Real human onboarding
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary shadow-glow" aria-hidden /> RFID-ready access
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden /> Cancel anytime
          </div>
        </div>
      </section>

      <section className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-display font-bold tracking-tighter sm:text-4xl text-white">Choose your tier.</h2>
            <p className="text-lg text-white/40 font-sans">All plans include unlimited gym access, locker usage, and member events.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {membershipPlans.map((plan) => {
              const isSelected = formData.membershipPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => updateField("membershipPlan", plan.id)}
                  className={`rounded-[2.5rem] border p-8 text-left transition duration-500 ${
                    isSelected
                      ? "border-primary bg-primary/10 text-white shadow-glow"
                      : "border-white/5 bg-white/[0.02] text-white/50 hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-primary/60">{plan.name}</p>
                  <p className="mt-4 text-4xl font-display font-bold text-white tracking-tighter">
                    {plan.price}
                    <span className="text-sm font-normal text-white/30"> {plan.cadence}</span>
                  </p>
                  <ul className="mt-6 space-y-2 text-sm font-sans">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40" aria-hidden />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
          {errors.membershipPlan ? (
            <p className="text-sm text-primary font-bold uppercase tracking-tight">{errors.membershipPlan}</p>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-10" aria-live="polite">
            <div className="space-y-6">
               <h3 className="text-2xl font-display font-bold text-white tracking-tighter underline decoration-primary/20 underline-offset-8">Personal Details</h3>
               <div className="grid gap-6 md:grid-cols-2">
                <Field
                  label="First name"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(event) => updateField("firstName", event.target.value)}
                  error={errors.firstName}
                />
                <Field
                  label="Last name"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  error={errors.lastName}
                />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Field
                  label="Email Address"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  error={errors.email}
                />
                <Field
                  label="Phone Number"
                  id="phone"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  error={errors.phone}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest font-sans" htmlFor="goals">
                Your Fitness Ambition
              </label>
              <textarea
                id="goals"
                value={formData.goals}
                onChange={(event) => updateField("goals", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-4 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none font-sans transition-all min-h-[120px]"
                placeholder="e.g., Build strength, improve mobility, prepare for competition"
              />
              {errors.goals ? <p className="text-sm text-primary font-bold font-sans">{errors.goals}</p> : null}
            </div>

            <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xl font-display font-bold text-white tracking-tighter">Add Personal Training</p>
                  <p className="text-sm text-white/30 font-sans">Maximize your results with expert coaching.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center gap-4 group">
                  <input
                    type="checkbox"
                    checked={formData.addTraining}
                    onChange={(event) => toggleTraining(event.target.checked)}
                    className="size-6 rounded-lg border-white/20 bg-transparent text-primary focus:ring-primary accent-primary"
                  />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/60 group-hover:text-primary transition-colors">Include Training</span>
                </label>
              </div>
              {formData.addTraining ? (
                <div className="grid gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <Field
                    label="Focus Area"
                    id="trainingFocus"
                    value={formData.trainingFocus ?? ""}
                    onChange={(event) => updateField("trainingFocus", event.target.value)}
                    error={errors.trainingFocus}
                    placeholder="Mobility, strength, conditioning..."
                  />
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field
                      label="Coach Preference"
                      id="trainerPreference"
                      value={formData.trainerPreference ?? ""}
                      onChange={(event) => updateField("trainerPreference", event.target.value)}
                      error={errors.trainerPreference}
                      placeholder="Energy level, style..."
                    />
                    <Field
                      label="Availability"
                      id="availability"
                      value={formData.availability ?? ""}
                      onChange={(event) => updateField("availability", event.target.value)}
                      error={errors.availability}
                      placeholder="Weekday mornings, etc."
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-4 pt-4">
              <label className="flex items-start gap-4 text-sm text-white/50 group cursor-pointer font-sans">
                <input
                  type="checkbox"
                  checked={formData.consentPolicies}
                  onChange={(event) => updateField("consentPolicies", event.target.checked)}
                  className="mt-1 size-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary accent-primary"
                />
                <span className="group-hover:text-white transition-colors">I agree to the gym policies and acknowledge that final activation occurs after staff review.</span>
              </label>
              {errors.consentPolicies ? (
                <p className="text-sm text-primary font-bold">{errors.consentPolicies}</p>
              ) : null}
              <label className="flex items-start gap-4 text-sm text-white/50 group cursor-pointer font-sans">
                <input
                  type="checkbox"
                  checked={formData.consentComms}
                  onChange={(event) => updateField("consentComms", event.target.checked)}
                  className="mt-1 size-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary accent-primary"
                />
                <span className="group-hover:text-white transition-colors">Keep me posted on community events and personal training availability.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex w-full items-center justify-center rounded-2xl bg-primary px-8 py-6 text-sm font-bold text-black transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-glow-strong uppercase tracking-[0.2em]"
            >
              {status === "submitting" ? "Processing..." : "Submit Registration"}
              <ArrowUpRight className="ml-2 size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {status === "success" ? (
              <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-10 text-white shadow-glow animate-in zoom-in duration-500">
                <p className="text-2xl font-display font-bold tracking-tighter underline decoration-primary underline-offset-8">Thank you! 🎉</p>
                <p className="mt-6 text-sm text-white/60 font-sans leading-relaxed">
                  Your registration is in our queue. Expect a confirmation call or email within one business day.
                  You can continue exploring the site while we prepare your onboarding kit.
                </p>
              </div>
            ) : null}
          </form>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-glow">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-primary/60 font-sans">Why Gymcentrix</p>
            <h3 className="mt-4 text-3xl font-display font-bold text-white tracking-tighter">Hybrid coaching for <span className="text-primary italic">real life.</span></h3>
            <p className="mt-6 text-white/40 leading-relaxed font-sans">
              Combine RFID-enabled gym access with personalized programming and biometric check-ins.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-white/60 font-sans">
              <li className="flex items-center gap-3">
                <div className="size-1.5 rounded-full bg-primary" />
                1:1 onboarding session
              </li>
              <li className="flex items-center gap-3">
                <div className="size-1.5 rounded-full bg-primary" />
                Locker + towel service included
              </li>
              <li className="flex items-center gap-3">
                <div className="size-1.5 rounded-full bg-primary" />
                Custom progress dashboard
              </li>
            </ul>
          </div>

          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 font-sans">FAQs</p>
            <div className="mt-8 space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question} className="space-y-3">
                  <p className="text-lg font-display font-bold text-white tracking-tighter">{faq.question}</p>
                  <p className="text-sm text-white/40 font-sans leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

type FieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
};

function Field({ label, id, value, onChange, error, type = "text", placeholder }: FieldProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-white/30 uppercase tracking-widest font-sans" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none font-sans transition-all"
      />
      {error ? <p className="text-sm text-primary font-bold font-sans">{error}</p> : null}
    </div>
  );
}
