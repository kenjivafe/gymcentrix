"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Fetches the local IP of the most recently seen agent for the current branch.
 * This enables the Kiosk to automatically discover the hardware station.
 */
export async function getAgentDiscovery(branchId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    const agent = await prisma.agent.findFirst({
      where: { 
        branchId,
        status: "ONLINE"
      },
      orderBy: {
        lastSeen: "desc"
      }
    });

    if (!agent || !(agent as any).localIp) {
      return { error: "No active agent found" };
    }

    return { 
      localIp: (agent as any).localIp,
      name: agent.name 
    };
  } catch (error) {
    console.error("[GET_AGENT_DISCOVERY_ERROR]", error);
    return { error: "Failed to fetch agent location" };
  }
}
