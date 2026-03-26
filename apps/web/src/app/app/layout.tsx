import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { PWAManager } from "@/components/app/pwa-manager";
import { PWAInstallBanner } from "@/components/app/pwa-install-banner";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gymcentrix",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  // If user is a super-admin, redirect them to their specific area
  if (user.role === "SUPER_ADMIN") {
    redirect("/super-admin");
  }

  // Ensure user is either a GYM_OWNER or an EMPLOYEE
  if (user.role !== "GYM_OWNER" && user.role !== "EMPLOYEE") {
    redirect("/login");
  }

  // Ensure they have a gymId assigned
  if (!user.gymId) {
    // This could happen for new owners who haven't completed onboarding
    // For now, let's redirect or show a setup page if needed
    // redirect("/onboarding");
  }

  return (
    <PWAManager>
      {children}
      <PWAInstallBanner />
    </PWAManager>
  );
}
