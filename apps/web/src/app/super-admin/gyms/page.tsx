import prisma from "@/lib/prisma";
import { GymsClient } from "@/components/super-admin/gyms-client";

export default async function GymsManagementPage() {
  const gyms = await prisma.gym.findMany({
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <GymsClient gyms={gyms} />;
}
