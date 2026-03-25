import { describe, expect, it } from "vitest";

import { registrationSchema } from "./registration";

const basePayload = {
  firstName: "Jamie",
  lastName: "Rivera",
  email: "jamie@example.com",
  phone: "555-123-4567",
  goals: "Build strength and improve conditioning",
  membershipPlan: "standard",
  addTraining: false,
  consentPolicies: true,
  consentComms: true,
};

describe("registrationSchema", () => {
  it("accepts membership-only submissions", () => {
    const result = registrationSchema.safeParse(basePayload);
    expect(result.success).toBe(true);
  });

  it("requires PT details when addTraining is true", () => {
    const result = registrationSchema.safeParse({
      ...basePayload,
      addTraining: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0]);
      expect(fields).toContain("trainingFocus");
      expect(fields).toContain("trainerPreference");
      expect(fields).toContain("availability");
    }
  });

  it("fails when required personal fields missing", () => {
    const { firstName, ...rest } = basePayload;
    const result = registrationSchema.safeParse({ ...rest, firstName: "" });
    expect(result.success).toBe(false);
  });

  it("blocks honeypot spam submissions", () => {
    const result = registrationSchema.safeParse({
      ...basePayload,
      honeypot: "bot",
    });
    expect(result.success).toBe(false);
  });
});
