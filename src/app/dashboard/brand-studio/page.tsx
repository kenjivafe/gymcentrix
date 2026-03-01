import type { Metadata, Route } from "next";

import { BrandStudio } from "@/components/brand-studio/brand-studio";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Brand Studio | Gymcentrix",
  description: "Manage brand identity (logo, colors) with live preview. Saving disabled until backend is ready.",
};

export default function BrandStudioRoute() {
  const brandStudioRoute = "/dashboard/brand-studio" as Route;

  return (
    <AppShell activeHref={brandStudioRoute}>
      <BrandStudio />
    </AppShell>
  );
}
