"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RegisterMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  gymId: z.string(),
  branchId: z.string(),
  rfidUid: z.string().optional().nullable(),
  membershipStatus: z.string().default("ACTIVE"),
  membershipExpiry: z.string().optional().nullable(),
});

export async function registerMember(data: z.infer<typeof RegisterMemberSchema>) {
  try {
    const validatedData = RegisterMemberSchema.parse(data);

    const member = await prisma.member.create({
      data: {
        name: validatedData.name,
        gymId: validatedData.gymId,
        branchId: validatedData.branchId,
        rfidUid: validatedData.rfidUid || null,
        membershipStatus: validatedData.membershipStatus,
        membershipExpiry: validatedData.membershipExpiry ? new Date(validatedData.membershipExpiry) : null,
      },
    });

    revalidatePath("/app/members");
    revalidatePath("/app");
    return { success: true, member };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.flatten().fieldErrors };
    }
    return { error: "Failed to register member. RFID UID might already be in use." };
  }
}

export async function updateMember(data: any) {
  try {
    const { id, ...updateData } = data;
    
    const member = await prisma.member.update({
      where: { id },
      data: {
        ...updateData,
        membershipExpiry: updateData.membershipExpiry ? new Date(updateData.membershipExpiry) : null,
      },
    });

    revalidatePath("/app/members");
    return { success: true, member };
  } catch (error) {
    return { error: "Failed to update member." };
  }
}

export async function deleteMember(id: string) {
  try {
    await prisma.member.delete({
      where: { id },
    });

    revalidatePath("/app/members");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete member." };
  }
}
