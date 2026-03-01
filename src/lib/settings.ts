/**
 * Types and mock data for Settings: subscription types, discounts, and feature flags.
 * UI-first; persistence when backend exists.
 */

export type SubscriptionType = {
  id: string;
  name: string;
  duration: string;
  price: string;
};

/** Discount duration: "always" means no end date / perpetual. */
export type DiscountDurationKind = "always" | "7 days" | "30 days" | "90 days";

export type Discount = {
  id: string;
  name: string;
  description: string;
  duration: DiscountDurationKind;
  price: string;
};

/** Deterministic mock subscription types. */
export const initialSubscriptionTypes: SubscriptionType[] = [
  { id: "sub-1", name: "Monthly", duration: "1 month", price: "49" },
  { id: "sub-2", name: "Quarterly", duration: "3 months", price: "129" },
  { id: "sub-3", name: "Annual", duration: "12 months", price: "449" },
];

/** Deterministic mock discounts. */
export const initialDiscounts: Discount[] = [
  {
    id: "disc-1",
    name: "Student",
    description: "Valid student ID required",
    duration: "always",
    price: "10",
  },
  {
    id: "disc-2",
    name: "First month half off",
    description: "New members only",
    duration: "30 days",
    price: "50",
  },
];

export const DISCOUNT_DURATION_OPTIONS: { label: string; value: DiscountDurationKind }[] = [
  { label: "Always", value: "always" },
  { label: "7 days", value: "7 days" },
  { label: "30 days", value: "30 days" },
  { label: "90 days", value: "90 days" },
];
