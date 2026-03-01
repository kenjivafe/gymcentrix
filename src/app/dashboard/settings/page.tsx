import type { Metadata, Route } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { SettingsPage } from "@/components/settings/settings-page";

export const metadata: Metadata = {
  title: "Settings | Gymcentrix",
  description:
    "Configure subscription types, discounts, and enable or disable Lockers, Employees, Attendance, and Card Designer.",
};

export default function SettingsRoute() {
  const settingsRoute = "/dashboard/settings" as Route;

  return (
    <AppShell activeHref={settingsRoute}>
      <SettingsPage />
    </AppShell>
  );
}
