import dotenv from "dotenv";
import path from "path";
// Correctly point to the root .env file from packages/db/prisma/seed.ts
dotenv.config({ path: path.join(process.cwd(), "../../.env") });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create Super Admin
  const adminEmail = "admin@gymcentrix.com";
  const adminPassword = "password123";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Super Admin",
      password: hashedAdminPassword,
      role: "SUPER_ADMIN",
    },
  });

  // Create a Gym Owner
  const ownerEmail = "owner@gymcentrix.com";
  const ownerPassword = "password123";
  const hashedOwnerPassword = await bcrypt.hash(ownerPassword, 10);

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      name: "Gym Owner",
      password: hashedOwnerPassword,
      role: "GYM_OWNER",
      gymId: "test-gym-1",
    },
  });

  // Create a test Gym
  const testGym = await prisma.gym.upsert({
    where: { id: "test-gym-1" },
    update: {},
    create: {
      id: "test-gym-1",
      name: "Gymcentrix Flagship",
      ownerId: owner.id,
    },
  });

  // Create a Branch
  const testBranch = await prisma.branch.upsert({
    where: { id: "test-branch-1" },
    update: {},
    create: {
      id: "test-branch-1",
      gymId: testGym.id,
      name: "Main Branch",
      address: "123 Main St, Metro Manila",
    },
  });

  // Create a Test Member
  const testMember = await prisma.member.upsert({
    where: { id: "test-member-1" },
    update: {},
    create: {
      id: "test-member-1",
      gymId: testGym.id,
      branchId: testBranch.id,
      name: "John Doe",
      rfidUid: "1234567890",
      membershipStatus: "ACTIVE",
    },
  });

  console.log("Users created/verified:", { admin: admin.email, owner: owner.email });
  console.log("Gym/Branch/Member created:", { gym: testGym.name, branch: testBranch.name, member: testMember.name, rfid: testMember.rfidUid });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
