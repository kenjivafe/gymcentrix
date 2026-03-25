export type Kpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
};

export type TimelineEntry = {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
};

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  badge?: string;
};

export const kpis: Kpi[] = [
  { label: "Active Members", value: "1,248", delta: "+6.2%", trend: "up" },
  { label: "RFID Cards", value: "932", delta: "+12", trend: "up" },
  { label: "Attendance Today", value: "418", delta: "-3.1%", trend: "down" },
  { label: "Locker Usage", value: "72%", delta: "+4%", trend: "up" },
];

export const timeline: TimelineEntry[] = [
  {
    id: "1",
    title: "RFID locker access",
    detail: "Maya Lopez unlocked Locker 12",
    timestamp: "12:41 PM",
  },
  {
    id: "2",
    title: "Membership card issued",
    detail: "Card #934 to Andre Lin",
    timestamp: "12:05 PM",
  },
  {
    id: "3",
    title: "Biometric attendance",
    detail: "Staff check-in: H. Santos",
    timestamp: "11:48 AM",
  },
  {
    id: "4",
    title: "Renewal",
    detail: "Annual plan renewed for K. Patel",
    timestamp: "11:24 AM",
  },
  {
    id: "5",
    title: "RFID locker access",
    detail: "Noelle Park unlocked Locker 03",
    timestamp: "10:58 AM",
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "create-card",
    label: "Create Membership Card",
    description: "Design and preview without saving",
    badge: "UI only",
  },
  {
    id: "enroll",
    label: "Enroll Member",
    description: "Coming soon: onboarding wizard",
  },
  {
    id: "locker",
    label: "RFID Locker Setup",
    description: "Configure lockers before launch",
  },
];

export const initialCardTemplate = {
  memberName: "Jordan Rivera",
  membershipTier: "Platinum",
  expiry: "12/2026",
  favoriteColor: "#4c8dff",
  accentColor: "#f97316",
  avatarSeed: "jr",
};

/** Default brand identity (system name Gymcentrix; used by BrandProvider defaults). */
export const defaultBrandState = {
  systemName: "Gymcentrix",
  gymName: "Elevate Lifestyle & Fitness",
  logoUrl: "/brand/elevate-logo.png",
  primaryColor: "#4c8dff",
  secondaryColor: "#f97316",
};
