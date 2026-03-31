import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import KioskDisplayClient from "./kiosk-client";

export default async function KioskDisplayPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).gymId) {
    redirect("/login");
  }

  const gym = await prisma.gym.findUnique({
    where: { id: (session.user as any).gymId },
    select: { 
      name: true, 
      activeBranchId: true,
      branches: { select: { id: true }, orderBy: { createdAt: "asc" }, take: 1 }
    },
  });

  if (!gym) {
    redirect("/login");
  }

  const resolvedBranchId = gym.activeBranchId || gym.branches[0]?.id;

  if (!resolvedBranchId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
        No facilities found. Please create a branch in your dashboard first.
      </div>
    );
  }

  return <KioskDisplayClient gymName={gym.name} branchId={resolvedBranchId} />;
}
