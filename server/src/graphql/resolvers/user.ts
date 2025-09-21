// This file contains all the business logic for handling User data.

import type { User, Task, UserRole } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
// FIX: The input types have been updated to match the latest schema.
interface CreateUserInput {
  email: string;
  // The password is required for the new auth system, but it's handled
  // by the auth.ts resolver, so we don't need it here.
  name: string;
  role?: UserRole;
  phone?: string;
  hourlyRate?: number;
}

interface UpdateUserInput {
  email?: string;
  name?: string;
  role?: UserRole;
  phone?: string;
  hourlyRate?: number;
}

export const userResolvers = {
  Query: {
    users: (
      _parent: unknown,
      _args: unknown,
      { prisma }: GraphQLContext
    ): Promise<User[]> => {
      return prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },
    user: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<User | null> => {
      // We need to omit the password field when returning a user for security.
      return prisma.user.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    // NOTE: The main 'createUser' logic is now in the 'auth.ts' resolver's 'register' function.
    // This mutation is for an admin creating a user, which would have a different flow
    // (e.g., sending an invite email instead of setting a password directly).
    // For now, we'll keep the logic but it won't be used by our current auth schema.
    createUser: (
      _parent: unknown,
      { input }: { input: CreateUserInput },
      { prisma }: GraphQLContext
    ): Promise<User> => {
      // In a real app, an admin creating a user would likely not set a password.
      // They would send an invite. We'll throw an error here to enforce using the 'register' mutation.
      throw new Error("Please use the 'register' mutation to create a new user with a password.");
    },
    updateUser: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateUserInput },
      { prisma }: GraphQLContext
    ): Promise<User> => {
      return prisma.user.update({
        where: { id },
        data: input,
      });
    },
    deleteUser: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<User> => {
      return prisma.user.delete({ where: { id } });
    },
  },

  // --- Relational Resolver ---
  User: {
    tasks: (parent: User, _args: unknown, { prisma }: GraphQLContext): Promise<Task[]> => {
      return prisma.task.findMany({
        where: { assignedToId: parent.id },
      });
    },
  },
};


