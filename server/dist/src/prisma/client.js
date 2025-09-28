// This file creates the single Prisma Client instance and defines the
// shape of the GraphQL context for the entire application.
import { PrismaClient } from '@prisma/client';
// The PrismaClient is instantiated once and exported.
export const prisma = new PrismaClient();
//# sourceMappingURL=client.js.map