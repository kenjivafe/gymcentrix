import type { Metadata, Route } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { MembersPage } from "@/components/members/members-page";

export const metadata: Metadata = {
  title: "Members Directory | Gymcentrix",
  description: "Browse mock member profiles, filters, and detail drawers for the Gymcentrix dashboard preview.",
};

export default function MembersRoute() {
  const membersRoute = "/dashboard/members" as Route;
  return (
    <AppShell activeHref={membersRoute}>
      <MembersPage />
    </AppShell>
  );
}
