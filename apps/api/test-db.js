const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const user = await prisma.user.findFirst({
      include: {
        _count: {
          select: {
            friends: {
              where: {
                friend: {
                  blockedBy: { none: { blockerId: '1' } }
                }
              }
            }
          }
        }
      }
    });
    console.log(user ? 'OK' : 'No user');
  } catch (e) {
    console.error('DB ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
