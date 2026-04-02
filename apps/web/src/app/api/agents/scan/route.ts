import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Authenticates the agent via x-api-key header.
 * Returns the agent record or a NextResponse error.
 */
async function authenticateAgent(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  const agent = await prisma.agent.findUnique({ where: { apiKey } });
  if (!agent) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  // Validate that the agent's branch is active under the gym's plan
  const branch = await prisma.branch.findUnique({
    where: { id: agent.branchId },
    include: {
      gym: {
        include: {
          branches: { orderBy: { createdAt: "asc" }, select: { id: true } },
        },
      },
    },
  });

  if (!branch) {
    return NextResponse.json({ error: "Agent branch not found" }, { status: 404 });
  }

  const gym = (branch as any).gym;
  if (gym.plan !== "ENTERPRISE") {
    const activeBranchId = gym.activeBranchId || gym.branches[0]?.id;
    if (branch.id !== activeBranchId) {
      return NextResponse.json(
        { error: "Branch is inactive under your current plan." },
        { status: 403 }
      );
    }
  }

  // Touch lastSeen
  await prisma.agent.update({
    where: { id: agent.id },
    data: { status: "ONLINE", lastSeen: new Date() },
  });

  return agent;
}

/**
 * POST /api/agents/scan
 *
 * Atomic RFID check-in endpoint for the hardware agent.
 * Authenticated via x-api-key header (not session).
 */
export async function POST(req: Request) {
  try {
    const authResult = await authenticateAgent(req);
    if (authResult instanceof NextResponse) return authResult;
    const agent = authResult;

    const { tagId } = await req.json();
    if (!tagId) {
      return NextResponse.json({ error: "tagId is required" }, { status: 400 });
    }

    // ── Check-in logic (mirrors apps/api/src/utils/checkin.ts) ──

    const member = await prisma.member.findUnique({
      where: { rfidUid: tagId },
    });

    // 1. UNKNOWN
    if (!member) {
      await (prisma as any).accessLog.create({
        data: {
          branchId: agent.branchId,
          agentId: agent.id,
          result: "DENIED",
          reason: "UNKNOWN_CARD",
          rfidUid: tagId,
        },
      });

      const eventPayload = {
        tagId,
        result: "DENIED",
        reason: "UNKNOWN_CARD",
        name: "Unknown",
        timestamp: Date.now(),
      };
      await prisma.branch.update({
        where: { id: agent.branchId },
        data: { lastScanId: JSON.stringify(eventPayload), lastScanTime: new Date() },
      });

      return NextResponse.json({
        success: false,
        result: "DENIED",
        reason: "UNKNOWN_CARD",
        error: "Member not found",
      });
    }

    // 2. BANNED / FROZEN
    if (member.membershipStatus === "BANNED" || member.membershipStatus === "FROZEN") {
      const reason = member.membershipStatus === "BANNED" ? "BANNED_MEMBER" : "FROZEN_MEMBERSHIP";
      await (prisma as any).accessLog.create({
        data: {
          memberId: member.id,
          branchId: agent.branchId,
          agentId: agent.id,
          result: "DENIED",
          reason,
          rfidUid: tagId,
        },
      });

      const eventPayload = {
        tagId,
        result: "DENIED",
        reason,
        name: member.name,
        timestamp: Date.now(),
      };
      await prisma.branch.update({
        where: { id: agent.branchId },
        data: { lastScanId: JSON.stringify(eventPayload), lastScanTime: new Date() },
      });

      return NextResponse.json({
        success: false,
        result: "DENIED",
        reason,
        member: { name: member.name },
        error: `Membership is ${member.membershipStatus}`,
      });
    }

    // 3. EXPIRED
    const now = new Date();
    if (member.membershipExpiry) {
      const expiry = new Date(member.membershipExpiry);
      expiry.setUTCHours(23, 59, 59, 999);

      if (now > expiry || member.membershipStatus === "EXPIRED") {
        await prisma.member.update({
          where: { id: member.id },
          data: { membershipStatus: "EXPIRED" },
        });
        await (prisma as any).accessLog.create({
          data: {
            memberId: member.id,
            branchId: agent.branchId,
            agentId: agent.id,
            result: "DENIED",
            reason: "EXPIRED_MEMBERSHIP",
            rfidUid: tagId,
          },
        });

        const eventPayload = {
          tagId,
          result: "DENIED",
          reason: "EXPIRED_MEMBERSHIP",
          name: member.name,
          timestamp: Date.now(),
        };
        await prisma.branch.update({
          where: { id: agent.branchId },
          data: { lastScanId: JSON.stringify(eventPayload), lastScanTime: new Date() },
        });

        return NextResponse.json({
          success: false,
          result: "DENIED",
          reason: "EXPIRED_MEMBERSHIP",
          member: { name: member.name },
        });
      }
    }

    // 4. AUTHORIZED
    await (prisma as any).accessLog.create({
      data: {
        memberId: member.id,
        branchId: agent.branchId,
        agentId: agent.id,
        result: "AUTHORIZED",
        rfidUid: tagId,
      },
    });

    await prisma.attendance.create({
      data: {
        memberId: member.id,
        branchId: agent.branchId,
        agentId: agent.id,
      },
    });

    const eventPayload = {
      tagId,
      result: "AUTHORIZED",
      name: member.name,
      timestamp: Date.now(),
    };
    await prisma.branch.update({
      where: { id: agent.branchId },
      data: { lastScanId: JSON.stringify(eventPayload), lastScanTime: new Date() },
    });

    return NextResponse.json({
      success: true,
      result: "AUTHORIZED",
      member: { name: member.name },
    });
  } catch (error) {
    console.error("[AGENTS_SCAN_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
