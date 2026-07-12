import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before Prisma initialization
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client is created per process
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
