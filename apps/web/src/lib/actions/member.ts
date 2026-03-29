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

    const expiryDate = validatedData.membershipExpiry ? new Date(validatedData.membershipExpiry) : null;
    let initialStatus = "ACTIVE";
    if (expiryDate && new Date() > expiryDate) {
      initialStatus = "EXPIRED";
    }

    const member = await prisma.member.create({
      data: {
        name: validatedData.name,
        gymId: validatedData.gymId,
        branchId: validatedData.branchId,
        rfidUid: validatedData.rfidUid || null,
        membershipStatus: initialStatus,
        membershipExpiry: expiryDate,
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

const UpdateMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  branchId: z.string(),
  rfidUid: z.string().optional().nullable(),
  membershipExpiry: z.string().optional().nullable(),
});

export async function updateMember(data: any) {
  try {
    const validatedData = UpdateMemberSchema.parse(data);
    const { id, ...updateData } = validatedData;
    
    const expiryDate = updateData.membershipExpiry ? new Date(updateData.membershipExpiry) : null;
    let newStatus = "ACTIVE";
    if (expiryDate && new Date() > expiryDate) {
      newStatus = "EXPIRED";
    }
    
    const member = await prisma.member.update({
      where: { id },
      data: {
        ...updateData,
        membershipStatus: newStatus,
        membershipExpiry: expiryDate,
      },
    });

    revalidatePath("/app/members");
    revalidatePath("/app");
    return { success: true, member };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.flatten().fieldErrors };
    }
    return { error: "Failed to update member. RFID UID might already be in use." };
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
