import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    const branches = await prisma.branch.findMany({
      where: { gymId: 'test-gym-1' },
      select: {
          id: true,
          name: true,
          gymId: true
      }
    })
    console.log("BRANCHES_DATA_START")
    console.log(JSON.stringify(branches, null, 2))
    console.log("BRANCHES_DATA_END")
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
