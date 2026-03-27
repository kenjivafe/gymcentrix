import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            gymId: true
        }
    })
    console.log("USERS_DATA_START")
    console.log(JSON.stringify(users, null, 2))
    console.log("USERS_DATA_END")
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
