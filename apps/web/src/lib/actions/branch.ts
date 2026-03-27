"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RegisterBranchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  gymId: z.string().min(1, "Please select a gym"),
});

export async function registerBranch(formData: z.infer<typeof RegisterBranchSchema>) {
  const result = RegisterBranchSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { name, address, gymId } = result.data;

  try {
    // Check branch limits based on subscription plan
    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: {
        plan: true,
        _count: {
          select: { branches: true }
        }
      }
    });

    if (!gym) return { error: "Gym facility not found." };
    
    if (gym.plan !== "ENTERPRISE" && gym._count.branches >= 1) {
      return { 
        error: "Branch limit reached. Enterprise subscription is required for multi-facility clusters." 
      };
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        address,
        gymId,
      },
    });

    revalidatePath("/super-admin/branches");
    return { success: true, branchId: branch.id };
  } catch (error) {
    console.error("Branch registration error:", error);
    return { error: "Failed to register branch. Please try again." };
  }
}

const UpdateBranchSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

export async function updateBranch(formData: z.infer<typeof UpdateBranchSchema>) {
  const result = UpdateBranchSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { id, name, address } = result.data;

  try {
    await prisma.branch.update({
      where: { id },
      data: { name, address },
    });

    revalidatePath("/super-admin/branches");
    revalidatePath(`/super-admin/branches/${id}`);
    
    // Also revalidate gym page to update branch list
    const branch = await prisma.branch.findUnique({
      where: { id },
      select: { gymId: true },
    });
    if (branch) {
      revalidatePath(`/super-admin/gyms/${branch.gymId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Branch update error:", error);
    return { error: "Failed to update branch details. Please try again." };
  }
}
