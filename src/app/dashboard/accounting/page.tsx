import type { Metadata, Route } from "next";

import { AccountingPage } from "@/components/accounting/accounting-page";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Accounting | Gymcentrix",
  description: "Daily revenue summaries and a mock transaction log for cashier reconciliation.",
};

export default function AccountingRoute() {
  const accountingRoute = "/dashboard/accounting" as Route;
  return (
    <AppShell activeHref={accountingRoute}>
      <AccountingPage />
    </AppShell>
  );
}
