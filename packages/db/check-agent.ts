import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const branch = await prisma.branch.findFirst({
    where: { id: "test-branch-1" },
    select: { id: true, lastScanId: true, lastScanTime: true }
  });
  console.log("BRANCH_CHECK:", branch);
  process.exit(0);
}
check();
