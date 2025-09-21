// This file is responsible for creating a single, shared instance of the Prisma Client.
// This is a best practice to prevent exhausting the database connection pool.

import { PrismaClient } from '@prisma/client';

// The PrismaClient is instantiated once and exported.
// By importing this 'prisma' object in other files, you ensure that all parts
// of your application are sharing the same database connection pool.
export const prisma = new PrismaClient();

// We also define and export the GraphQL context type here.
// This creates a single source of truth for what our resolver's
// context object will look like. All resolvers will import this type.
export interface GraphQLContext {
  prisma: PrismaClient;
}

