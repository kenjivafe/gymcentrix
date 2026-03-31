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

/**
 * Fetches the latest global scan for the current branch.
 * Enables kiosks to receive scans regardless of network location.
 */
export async function getLatestScan(branchId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    if (!branchId) return { error: "No branchId provided" };

    // Use raw query to completely bypass Vercel's Prisma Client cache
    // since the client might not be aware of the new lastScanId columns yet.
    const result: any[] = await prisma.$queryRaw`SELECT "lastScanId", "lastScanTime" FROM "Branch" WHERE id = ${branchId}`;
    
    if (!result || result.length === 0) {
      return { error: "Branch not found in DB via raw query" };
    }

    const branch = result[0];

    if (!branch.lastScanId) {
       return { error: "No scans recorded for this branch yet." };
    }

    return { 
      lastScanId: branch.lastScanId,
      time: branch.lastScanTime
    };
  } catch (error: any) {
    return { error: error.message || "Catch block hit" };
  }
}
