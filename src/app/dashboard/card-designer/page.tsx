import type { Metadata, Route } from "next";

import { CardDesigner } from "@/components/card-designer/card-designer";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Card Designer | Gymcentrix",
  description: "UI-first membership card template editor with live preview (saving disabled).",
};

export default function CardDesignerRoute() {
  const cardDesignerRoute = "/dashboard/card-designer" as Route;

  return (
    <AppShell activeHref={cardDesignerRoute}>
      <CardDesigner />
    </AppShell>
  );
}
