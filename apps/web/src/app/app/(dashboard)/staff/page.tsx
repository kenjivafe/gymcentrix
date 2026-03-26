import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StaffClient } from "@/components/app/staff-client";

export default async function StaffManagementPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role !== "GYM_OWNER") {
    redirect("/app");
  }

  const staff = await prisma.user.findMany({
    where: { 
      gymId: user.gymId,
      role: "EMPLOYEE"
    },
    orderBy: { name: "asc" },
  });

  return (
    <StaffClient staff={staff} />
  );
}
