const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.userProfile.updateMany({
    where: { displayName: 'Demo User' },
    data: { 
      displayName: 'Bhagyalaxmi',
      avatarUrl: 'https://ui-avatars.com/api/?name=B+L&background=1DB954&color=fff'
    }
  });
  console.log('Profile updated successfully in DB!');
}

main()
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect();
    pool.end();
  });
