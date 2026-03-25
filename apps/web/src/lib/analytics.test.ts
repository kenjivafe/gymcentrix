import { describe, expect, it } from "vitest";

import { formatPercent, normalizeSeries, summarizeSeries } from "./analytics";

describe("analytics utilities", () => {
  it("formats percent with sign and one decimal", () => {
    expect(formatPercent(6.24)).toBe("+6.2%");
    expect(formatPercent(-3.11)).toBe("-3.1%");
    expect(formatPercent(0)).toBe("0%");
  });

  it("summarizes series with delta and direction", () => {
    const summaryUp = summarizeSeries([10, 12]);
    expect(summaryUp.current).toBe(12);
    expect(summaryUp.previous).toBe(10);
    expect(summaryUp.direction).toBe("up");

    const summaryDown = summarizeSeries([10, 8]);
    expect(summaryDown.direction).toBe("down");

    const summaryFlat = summarizeSeries([10, 10]);
    expect(summaryFlat.direction).toBe("flat");
  });

  it("normalizes series to 0..1 scale", () => {
    expect(normalizeSeries([0, 10, 20])).toEqual([0, 0.5, 1]);
    expect(normalizeSeries([0, 0, 0])).toEqual([0, 0, 0]);
  });
});
