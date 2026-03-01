import type { Metadata, Route } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { EmployeesPage } from "@/components/employees/employees-page";

export const metadata: Metadata = {
  title: "Employees Attendance | Gymcentrix",
  description: "Preview staff attendance tracking with mock biometric logs inside the Gymcentrix dashboard.",
};

export default function EmployeesRoute() {
  const employeesRoute = "/dashboard/employees" as Route;
  return (
    <AppShell activeHref={employeesRoute}>
      <EmployeesPage />
    </AppShell>
  );
}
