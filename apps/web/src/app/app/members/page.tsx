import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MemberClient } from "@/components/app/member-client";

export default async function MembersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const gymId = user?.gymId;

  if (!gymId) return null;

  const [members, branches] = await Promise.all([
    prisma.member.findMany({
      where: { gymId },
      include: {
        branch: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.branch.findMany({
      where: { gymId },
      select: { id: true, name: true }
    })
  ]);

  return (
    <MemberClient 
      members={members} 
      branches={branches} 
      gymId={gymId} 
    />
  );
}
