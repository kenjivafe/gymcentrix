const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const members = await prisma.member.findMany({
    include: { gym: true, branch: true }
  });
  console.log("Found members:", JSON.stringify(members, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
