const dotenv = require("dotenv");
const path = require("path");
// Load environment variables from the root .env
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const branchId = "test-branch-1";
  const memberId = "test-member-1";

  console.log(`Seeding mock scan events in AccessLog for Branch: ${branchId}, Member: ${memberId}`);

  // Create a mix of statuses
  const statuses = [
    { status: 'AUTHORIZED', memberId: memberId, delay: 0 },
    { status: 'EXPIRED', memberId: memberId, delay: 60000 }, // 1 min ago
    { status: 'DENIED', memberId: memberId, delay: 120000 }, // 2 mins ago
    { status: 'UNKNOWN', memberId: null, delay: 180000, rfidUid: 'UNKNOWN_TAG_777' } // 3 mins ago
  ];

  for (const s of statuses) {
    // We use cast to any because prisma generate might not have updated the client yet
    await (prisma as any).accessLog.create({
      data: {
        branchId,
        memberId: s.memberId,
        status: s.status,
        rfidUid: s.rfidUid || '1234567890',
        timestamp: new Date(Date.now() - s.delay)
      }
    });
    console.log(`Created ${s.status} access log`);
  }

  console.log("Seeding complete. Check the dashboard!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
