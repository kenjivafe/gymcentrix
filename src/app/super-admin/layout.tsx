import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { SuperAdminShell } from "@/components/super-admin/super-admin-shell";

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  if (user.role !== "SUPER_ADMIN") {
    redirect("/"); // Or an unauthorized page
  }

  return (
    <SuperAdminShell userName={session.user?.name}>
        {children}
    </SuperAdminShell>
  );
}
