import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const agents = await prisma.agent.findMany();
  console.log("ALL_AGENTS:", agents);
  process.exit(0);
}
check();
