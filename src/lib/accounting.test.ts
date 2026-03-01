import { describe, expect, it } from "vitest";

import {
  accountingSummary,
  accountingTransactions,
  computePaymentMix,
  filterTransactions,
  formatCurrency,
} from "./accounting";

describe("accounting utilities", () => {
  it("formats currency", () => {
    expect(formatCurrency(0)).toMatch(/₱|PHP/);
  });

  it("computes payment mix ratios", () => {
    const mix = computePaymentMix(accountingSummary);
    expect(mix.cash + mix.card + mix.online).toBeCloseTo(1, 5);
  });

  it("filters transactions by query", () => {
    const result = filterTransactions(accountingTransactions, {
      query: "RCPT-10484",
      method: "all",
      category: "all",
      status: "all",
      datePreset: "today",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.receiptId).toBe("RCPT-10484");
  });

  it("filters transactions by payment method", () => {
    const result = filterTransactions(accountingTransactions, {
      query: "",
      method: "card",
      category: "all",
      status: "all",
      datePreset: "today",
    });

    expect(result.every((txn) => txn.method === "card")).toBe(true);
  });
});
