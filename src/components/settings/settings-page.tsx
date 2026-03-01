"use client";

import { useState } from "react";
import { Calendar, CreditCard, GaugeCircle, KeyRound, Percent, Plus, UserCog, X } from "lucide-react";

import { useFeatureFlags } from "@/components/settings/feature-flags-context";
import {
  DISCOUNT_DURATION_OPTIONS,
  initialDiscounts,
  initialSubscriptionTypes,
  type Discount,
  type DiscountDurationKind,
  type SubscriptionType,
} from "@/lib/settings";

function SectionHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/80">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-white/60">{description}</p>
      </div>
    </div>
  );
}

function SubscriptionRow({
  sub,
  onChange,
  onRemove,
}: {
  sub: SubscriptionType;
  onChange: (id: string, partial: Partial<SubscriptionType>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[1fr_1fr_120px]">
        <input
          type="text"
          value={sub.name}
          onChange={(e) => onChange(sub.id, { name: e.target.value })}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
          placeholder="Name"
        />
        <input
          type="text"
          value={sub.duration}
          onChange={(e) => onChange(sub.id, { duration: e.target.value })}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
          placeholder="Duration (e.g. 1 month)"
        />
        <input
          type="text"
          value={sub.price}
          onChange={(e) => onChange(sub.id, { price: e.target.value })}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
          placeholder="Price"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(sub.id)}
        className="shrink-0 self-center rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
        aria-label="Remove subscription type"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function DiscountRow({
  discount,
  onChange,
  onRemove,
}: {
  discount: Discount;
  onChange: (id: string, partial: Partial<Discount>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={discount.name}
            onChange={(e) => onChange(discount.id, { name: e.target.value })}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
            placeholder="Discount name"
          />
          <input
            type="text"
            value={discount.price}
            onChange={(e) => onChange(discount.id, { price: e.target.value })}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
            placeholder="Price / amount"
          />
        </div>
        <input
          type="text"
          value={discount.description}
          onChange={(e) => onChange(discount.id, { description: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
          placeholder="Description"
        />
        <select
          value={discount.duration}
          onChange={(e) =>
            onChange(discount.id, { duration: e.target.value as DiscountDurationKind })
          }
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-primary focus:outline-none"
        >
          {DISCOUNT_DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-canvas text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={() => onRemove(discount.id)}
        className="shrink-0 self-start rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
        aria-label="Remove discount"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function ToggleRow({
  label,
  enabled,
  onToggle,
  icon: Icon,
}: {
  label: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-white/70" />
        <span className="font-medium text-white">{label}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onToggle(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-primary" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const { flags, setFlag } = useFeatureFlags();
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>(
    () => initialSubscriptionTypes
  );
  const [discounts, setDiscounts] = useState<Discount[]>(() => initialDiscounts);

  const updateSubscription = (id: string, partial: Partial<SubscriptionType>) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...partial } : s))
    );
  };

  const updateDiscount = (id: string, partial: Partial<Discount>) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...partial } : d))
    );
  };

  const addSubscription = () => {
    setSubscriptions((prev) => [
      ...prev,
      { id: `sub-${Date.now()}`, name: "", duration: "", price: "" },
    ]);
  };

  const addDiscount = () => {
    setDiscounts((prev) => [
      ...prev,
      {
        id: `disc-${Date.now()}`,
        name: "",
        description: "",
        duration: "always",
        price: "",
      },
    ]);
  };

  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const removeDiscount = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-sm uppercase text-white/60">Configuration</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="text-white/70">
          Manage subscription types, discounts, and which dashboard modules are enabled.
        </p>
      </header>

      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5/30 p-6 shadow-card backdrop-blur">
        <SectionHeader
          title="Subscription types"
          description="Name, duration, and price for each plan. Changes are local until backend is wired."
          icon={Calendar}
        />
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <SubscriptionRow
              key={sub.id}
              sub={sub}
              onChange={updateSubscription}
              onRemove={removeSubscription}
            />
          ))}
          <button
            type="button"
            onClick={addSubscription}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add subscription type
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5/30 p-6 shadow-card backdrop-blur">
        <SectionHeader
          title="Discounts"
          description="Name, description, duration (use Always for no expiry), and price. Changes are local until backend is wired."
          icon={Percent}
        />
        <div className="space-y-3">
          {discounts.map((d) => (
            <DiscountRow
              key={d.id}
              discount={d}
              onChange={updateDiscount}
              onRemove={removeDiscount}
            />
          ))}
          <button
            type="button"
            onClick={addDiscount}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add discount
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5/30 p-6 shadow-card backdrop-blur">
        <SectionHeader
          title="Feature toggles"
          description="Enable or disable dashboard modules. Disabled modules are hidden from the sidebar."
          icon={CreditCard}
        />
        <div className="space-y-2">
          <ToggleRow
            label="Lockers"
            enabled={flags.lockers}
            onToggle={(v) => setFlag("lockers", v)}
            icon={KeyRound}
          />
          <ToggleRow
            label="Employees"
            enabled={flags.employees}
            onToggle={(v) => setFlag("employees", v)}
            icon={UserCog}
          />
          <ToggleRow
            label="Attendance"
            enabled={flags.attendance}
            onToggle={(v) => setFlag("attendance", v)}
            icon={GaugeCircle}
          />
          <ToggleRow
            label="Card Designer"
            enabled={flags.cardDesigner}
            onToggle={(v) => setFlag("cardDesigner", v)}
            icon={CreditCard}
          />
        </div>
      </section>
    </div>
  );
}
