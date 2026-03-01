import { describe, expect, it } from "vitest";

import Page from "./page";

describe("/dashboard/settings route", () => {
  it("exports a default component", () => {
    expect(typeof Page).toBe("function");
  });
});
