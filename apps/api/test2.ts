import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const res = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: 'alex', mode: 'insensitive' } },
          { email: { contains: 'alex', mode: 'insensitive' } },
          { profile: { displayName: { contains: 'alex', mode: 'insensitive' } } }
        ]
      },
      include: { profile: true }
    });
    console.log("SUCCESS:", JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
