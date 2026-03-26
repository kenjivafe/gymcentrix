"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Role } from "@gymcentrix/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const RegisterStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export async function registerStaff(data: z.infer<typeof RegisterStaffSchema>) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as any;

  if (!currentUser || currentUser.role !== "GYM_OWNER") {
    return { error: "Unauthorized. Only gym owners can register staff." };
  }

  const result = RegisterStaffSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { name, email } = result.data;

  try {
    const staff = await prisma.user.create({
      data: {
        name,
        email,
        role: Role.EMPLOYEE,
        gymId: currentUser.gymId,
      },
    });

    revalidatePath("/app/staff");
    return { success: true, staffId: staff.id };
  } catch (error) {
    return { error: "Failed to register staff. Email might already be in use." };
  }
}

export async function deleteStaff(id: string) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as any;

  if (!currentUser || currentUser.role !== "GYM_OWNER") {
    return { error: "Unauthorized." };
  }

  try {
    const staff = await prisma.user.findUnique({ where: { id } });
    
    if (!staff || staff.gymId !== currentUser.gymId || staff.role !== Role.EMPLOYEE) {
      return { error: "Invalid staff member." };
    }

    await prisma.user.delete({ where: { id } });

    revalidatePath("/app/staff");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete staff member." };
  }
}
