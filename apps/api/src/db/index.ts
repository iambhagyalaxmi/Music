import { PrismaClient, Prisma } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/soundsphere';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: any };

const createExtendedClient = () => {
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

  return client.$extends({
    query: {
      $allModels: {
        async $allOperations(params: { model: string; operation: string; args: any; query: (args: any) => Promise<any> }) {
          const { model, operation, args, query } = params;
          const softDeleteModels = [
            'User', 'Artist', 'Album', 'Song', 'Playlist', 'MusicVideo'
          ];
          
          if (softDeleteModels.includes(model)) {
            const anyArgs = args as any;
            // Read operations
            if (['findUnique', 'findFirst', 'findMany', 'count'].includes(operation)) {
              anyArgs.where = { ...anyArgs.where, deletedAt: null };
            }
            
            // Delete operations -> soft delete
            if (operation === 'delete') {
              return (client as any)[model].update({
                where: anyArgs.where,
                data: { deletedAt: new Date() },
              });
            }
            if (operation === 'deleteMany') {
              return (client as any)[model].updateMany({
                where: anyArgs.where,
                data: { deletedAt: new Date() },
              });
            }
          }
          
          return query(args);
        },
      },
    },
  });
};

export const db = globalForPrisma.prisma ?? createExtendedClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
