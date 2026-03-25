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
