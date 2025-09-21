

// This file creates the single Prisma Client instance and defines the
// shape of the GraphQL context for the entire application.

import { PrismaClient } from '@prisma/client';
// FIX: Changed to a type-only import for better module resolution.
import type { User } from '@prisma/client';

// The PrismaClient is instantiated once and exported.
export const prisma = new PrismaClient();

// We define and export the GraphQL context type here.
// It's typed as 'User | null' because a user might not be logged in.
export interface GraphQLContext {
  prisma: PrismaClient;
  currentUser: User | null;
}

