const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up invalid Attendance records (memberId: null)...");
  const deleted = await prisma.attendance.deleteMany({
    where: { memberId: null }
  });
  console.log(`Deleted ${deleted.count} records.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
