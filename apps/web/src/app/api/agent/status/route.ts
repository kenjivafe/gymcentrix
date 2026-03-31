import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, localIp } = body;

    const agent = await prisma.agent.update({
      where: { apiKey },
      data: {
        status: status || "ONLINE",
        localIp,
        lastSeen: new Date(),
      } as any,
      include: {
        branch: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      agent: {
        id: agent.id,
        name: agent.name,
        branchId: agent.branchId,
        gymId: agent.branch.gymId
      }
    });
  } catch (error) {
    console.error("[AGENT_STATUS_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
