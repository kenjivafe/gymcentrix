const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const agent = await p.agent.findUnique({
    where: { apiKey: "sk_c00de8d205ec4aad8b89cb28c64b53b2e0d8656d6d64d356" },
    include: { branch: { include: { gym: true } } }
  });
  console.log(JSON.stringify(agent, null, 2));
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
