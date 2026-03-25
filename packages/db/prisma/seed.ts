import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@gymcentrix.com";
  const adminPassword = "password123"; // You should change this later
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log({ admin });

  // Create a test Gym
  const testGym = await prisma.gym.upsert({
    where: { id: "test-gym-1" },
    update: {},
    create: {
      id: "test-gym-1",
      name: "Gymcentrix Flagship",
      ownerId: admin.id,
    },
  });

  console.log({ testGym });
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
