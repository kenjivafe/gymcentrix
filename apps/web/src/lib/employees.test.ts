import { describe, expect, it } from "vitest";

import { employees, filterEmployees, type AttendanceStatus, type EmployeeRole } from "./employees";

describe("filterEmployees", () => {
  it("filters by name query", () => {
    const result = filterEmployees(employees, "Mara", "all", "all");
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Mara Bautista");
  });

  it("filters by attendance status", () => {
    const result = filterEmployees(employees, "", "warning", "all");
    expect(result.every((employee) => employee.compliance === "warning")).toBe(true);
  });

  it("filters by role and query together", () => {
    const result = filterEmployees(employees, "Theo", "all", "Maintenance");
    expect(result).toHaveLength(1);
    expect(result[0]?.role).toBe("Maintenance");
  });

  it("returns all when filters are set to all", () => {
    const result = filterEmployees(employees, "", "all", "all");
    expect(result).toHaveLength(employees.length);
  });

  it("handles unmatched filters", () => {
    const result = filterEmployees(employees, "Nope", "missed", "Coach" as EmployeeRole);
    expect(result).toHaveLength(0);
  });

  it("handles status only filter with no matches", () => {
    const result = filterEmployees(employees, "", "missed" as AttendanceStatus, "Sales");
    expect(result).toHaveLength(0);
  });
});
