import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppShell } from "@/components/app/app-shell";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // session exists because of parent layout
  const user = session!.user as any;

  return (
    <AppShell 
      userName={session?.user?.name} 
      role={user.role}
      gymId={user.gymId}
    >
        {children}
    </AppShell>
  );
}
