export type TrendDirection = "up" | "down" | "flat";

export type AnalyticsSeries = {
  label: string;
  values: number[];
};

export type BreakdownItem = {
  label: string;
  value: number;
};

export const analyticsSeries: AnalyticsSeries[] = [
  { label: "Daily check-ins", values: [312, 328, 301, 356, 402, 418, 390] },
  { label: "New members", values: [8, 12, 9, 14, 11, 15, 10] },
  { label: "Locker claims", values: [66, 72, 61, 78, 85, 92, 80] },
];

export const analyticsBreakdowns: Array<{ title: string; items: BreakdownItem[] }> = [
  {
    title: "Check-ins by tier",
    items: [
      { label: "Standard", value: 168 },
      { label: "Premium", value: 122 },
      { label: "Elite", value: 84 },
      { label: "Student", value: 44 },
    ],
  },
  {
    title: "Peak entry windows",
    items: [
      { label: "5–8 AM", value: 162 },
      { label: "8–11 AM", value: 118 },
      { label: "11–2 PM", value: 64 },
      { label: "2–5 PM", value: 56 },
      { label: "5–9 PM", value: 92 },
    ],
  },
];

export function formatPercent(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}%`;
}

export function summarizeSeries(values: number[]) {
  if (values.length < 2) {
    return {
      current: values[0] ?? 0,
      previous: 0,
      deltaPercent: 0,
      direction: "flat" as TrendDirection,
    };
  }

  const current = values[values.length - 1] ?? 0;
  const previous = values[values.length - 2] ?? 0;
  const deltaPercent = previous === 0 ? 0 : ((current - previous) / previous) * 100;

  let direction: TrendDirection = "flat";
  if (current > previous) direction = "up";
  if (current < previous) direction = "down";

  return { current, previous, deltaPercent, direction };
}

export function normalizeSeries(values: number[]) {
  const max = Math.max(...values, 0);
  if (max === 0) return values.map(() => 0);
  return values.map((value) => value / max);
}
