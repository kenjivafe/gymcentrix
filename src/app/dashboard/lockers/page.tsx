import type { Metadata, Route } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { LockersPage } from "@/components/lockers/lockers-page";

export const metadata: Metadata = {
  title: "Lockers | Gymcentrix",
  description: "Track locker occupancy sessions claimed by RFID and released at cashier logout.",
};

export default function LockersRoute() {
  const lockersRoute = "/dashboard/lockers" as Route;
  return (
    <AppShell activeHref={lockersRoute}>
      <LockersPage />
    </AppShell>
  );
}
