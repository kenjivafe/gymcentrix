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
    select: { name: true },
  });

  if (!gym) {
    redirect("/login");
  }

  return <KioskDisplayClient gymName={gym.name} />;
}
