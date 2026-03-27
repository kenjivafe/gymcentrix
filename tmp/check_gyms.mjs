import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    const gyms = await prisma.gym.findMany()
    console.log("GYMS_DATA_START")
    console.log(JSON.stringify(gyms, null, 2))
    console.log("GYMS_DATA_END")
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
