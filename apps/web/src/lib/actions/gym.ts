"use server";

import prisma from "@/lib/prisma";
import { Role } from "@gymcentrix/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RegisterGymSchema = z.object({
  name: z.string().min(2, "Gym name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerEmail: z.string().email("Invalid owner email address"),
});

export async function registerGym(formData: z.infer<typeof RegisterGymSchema>) {
  const result = RegisterGymSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { name, ownerName, ownerEmail } = result.data;

  try {
    // 1. Atomic transaction to create/update owner and create gym
    const gym = await prisma.$transaction(async (tx) => {
      // Find or create owner
      let owner = await tx.user.findUnique({
        where: { email: ownerEmail },
      });

      if (owner) {
        // Promote to GYM_OWNER if not already
        if (owner.role === Role.EMPLOYEE) {
          owner = await tx.user.update({
            where: { id: owner.id },
            data: { role: Role.GYM_OWNER },
          });
        }
      } else {
        // Create new owner
        owner = await tx.user.create({
          data: {
            name: ownerName,
            email: ownerEmail,
            role: Role.GYM_OWNER,
            // Password should be set via invitation flow later, 
            // but for now we'll leave it null or set a temporary one if needed
          },
        });
      }

      // Create gym
      return await tx.gym.create({
        data: {
          name,
          ownerId: owner.id,
        },
      });
    });

    revalidatePath("/super-admin/gyms");
    return { success: true, gymId: gym.id };
  } catch (error) {
    console.error("Gym registration error:", error);
    return { error: "Failed to register gym. Please try again." };
  }
}
const UpdateGymSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Gym name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerEmail: z.string().email("Invalid owner email address"),
});

export async function updateGym(formData: z.infer<typeof UpdateGymSchema>) {
  const result = UpdateGymSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { id, name, ownerName, ownerEmail } = result.data;

  try {
    await prisma.$transaction([
      prisma.gym.update({
        where: { id },
        data: { name },
      }),
      prisma.user.update({
        where: { id: (await prisma.gym.findUnique({ where: { id }, select: { ownerId: true } }))?.ownerId },
        data: {
          name: ownerName,
          email: ownerEmail,
        },
      }),
    ]);

    revalidatePath("/super-admin/gyms");
    revalidatePath(`/super-admin/gyms/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Gym update error:", error);
    return { error: "Failed to update gym details. Please try again." };
  }
}
