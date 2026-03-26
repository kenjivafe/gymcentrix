import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    const gymId = user?.gymId;

    if (!gymId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rfid, device_type } = await req.json();

    if (!rfid) {
      return NextResponse.json({ error: "RFID required" }, { status: 400 });
    }

    // 1. Find member by RFID and gymId
    const member = await prisma.member.findFirst({
      where: {
        rfidUid: rfid,
        gymId: gymId,
      },
      include: {
        branch: true,
      }
    });

    if (!member) {
      return NextResponse.json({ status: "not_found" });
    }

    // 2. Check membership status and expiry
    const isExpired = member.membershipStatus !== "ACTIVE" || (member.membershipExpiry && new Date(member.membershipExpiry) < new Date());

    if (isExpired) {
      return NextResponse.json({ status: "expired", name: member.name });
    }

    // 3. Log attendance
    // For kiosk, we use the member's default branch if not specified
    // In a real scenario, we might want to know WHICH branch the kiosk is at
    await prisma.attendance.create({
      data: {
        memberId: member.id,
        branchId: member.branchId,
        // agentId is null for kiosk (self-checkin)
      }
    });

    // 4. Revalidate attendance pages
    revalidatePath("/app/attendance");
    revalidatePath("/app");

    return NextResponse.json({ 
      status: "success", 
      name: member.name,
      branch: member.branch.name
    });
  } catch (error) {
    console.error("Kiosk check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
