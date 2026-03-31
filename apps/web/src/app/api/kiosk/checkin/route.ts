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

    const { rfid } = await req.json();

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
      // Update branch even for unknown scans so kiosks can show "Not Found"
      const eventPayload = {
        tagId: rfid,
        result: 'DENIED',
        reason: 'UNKNOWN_CARD',
        name: 'Unknown',
        timestamp: Date.now()
      };
      await (prisma as any).branch.update({
        where: { id: user.activeBranchId || (member as any)?.branchId }, // Fallback if no member
        data: { lastScanId: JSON.stringify(eventPayload), lastScanTime: new Date() }
      }).catch(() => {}); // Ignore if activeBranchId is missing

      return NextResponse.json({ 
        success: false,
        result: "DENIED", 
        reason: "UNKNOWN_CARD",
        error: "Account not found" 
      });
    }

    // 2. DENIED case (Member exists but is Banned/Frozen)
    if (member.membershipStatus === 'BANNED' || member.membershipStatus === 'FROZEN') {
      const reason = member.membershipStatus === 'BANNED' ? 'BANNED_MEMBER' : 'FROZEN_MEMBERSHIP';
      
      await (prisma as any).accessLog.create({
        data: {
          memberId: member.id,
          branchId: member.branchId,
          result: 'DENIED',
          reason,
          rfidUid: rfid
        }
      });

      const eventPayload = {
        tagId: rfid,
        result: 'DENIED',
        reason,
        name: member.name,
        timestamp: Date.now()
      };
      await (prisma as any).branch.update({
        where: { id: member.branchId },
        data: { lastScanId: JSON.stringify(eventPayload), lastScanTime: new Date() }
      });

      return NextResponse.json({ 
        success: false,
        result: "DENIED", 
        reason,
        name: member.name,
        error: `Membership is ${member.membershipStatus}`
      });
    }

    // 3. Check membership expiry
    const now = new Date();
    if (member.membershipExpiry) {
      const expiry = new Date(member.membershipExpiry);
      expiry.setUTCHours(23, 59, 59, 999);

      if (now > expiry || member.membershipStatus === 'EXPIRED') {
        await prisma.member.update({ where: { id: member.id }, data: { membershipStatus: 'EXPIRED' } });
        
        await (prisma as any).accessLog.create({
          data: {
            memberId: member.id,
            branchId: member.branchId,
            result: 'DENIED',
            reason: 'EXPIRED_MEMBERSHIP',
            rfidUid: rfid
          }
        });

        const eventPayload = {
          tagId: rfid,
          result: 'DENIED',
          reason: 'EXPIRED_MEMBERSHIP',
          name: member.name,
          timestamp: Date.now()
        };
        await (prisma as any).branch.update({
          where: { id: member.branchId },
          data: { lastScanId: JSON.stringify(eventPayload), lastScanTime: new Date() }
        });

        return NextResponse.json({ 
          success: false,
          result: "DENIED", 
          reason: "EXPIRED_MEMBERSHIP",
          name: member.name 
        });
      }
    }

    // 4. Log authorized access attempt
    await (prisma as any).accessLog.create({
      data: {
        memberId: member.id,
        branchId: member.branchId,
        result: 'AUTHORIZED',
        rfidUid: rfid
      }
    });

    // Record the actual attendance metric
    await prisma.attendance.create({
      data: {
        memberId: member.id,
        branchId: member.branchId,
      }
    });

    const eventPayload = {
      tagId: rfid,
      result: 'AUTHORIZED',
      name: member.name,
      timestamp: Date.now()
    };
    await (prisma as any).branch.update({
      where: { id: member.branchId },
      data: { lastScanId: JSON.stringify(eventPayload), lastScanTime: new Date() }
    });

    // 5. Revalidate attendance pages
    revalidatePath("/app/attendance");
    revalidatePath("/app");

    return NextResponse.json({ 
      success: true,
      result: "AUTHORIZED", 
      name: member.name,
      branch: member.branch.name
    });
  } catch (error) {
    console.error("Kiosk check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
