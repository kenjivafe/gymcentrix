"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function createAgent(branchId: string, name: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const gymId = (session.user as any).gymId;
    if (!gymId) return { error: "No gym associated with user" };

    // Verify branch belongs to gym
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch || branch.gymId !== gymId) {
      return { error: "Invalid branch" };
    }

    // Generate unique API key matching standard sk_ format
    const apiKey = `sk_${crypto.randomBytes(24).toString("hex")}`;

    const agent = await prisma.agent.create({
      data: {
        name,
        branchId,
        apiKey,
        status: "OFFLINE",
      },
    });

    revalidatePath("/app/agents");

    return { success: true, agent, apiKey };
  } catch (error: any) {
    console.error("Failed to create agent:", error);
    return { error: "An unexpected error occurred while provisioning the agent." };
  }
}
