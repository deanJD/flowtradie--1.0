// This file contains all the business logic for handling User data.

import type { User, Task } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
// REFACTORED: We now use TypeScript utility types to derive our inputs
// directly from the Prisma User model. This is a cleaner and more scalable pattern.
type CreateUserInput = Pick<User, 'email' | 'name' | 'role' | 'phone' | 'hourlyRate'>;

// 'Partial' makes all properties optional, which is perfect for update mutations.
type UpdateUserInput = Partial<CreateUserInput>;

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
      return prisma.user.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createUser: (
      _parent: unknown,
      { input }: { input: CreateUserInput },
      { prisma }: GraphQLContext
    ): Promise<User> => {
      // Prisma expects 'null' for optional fields if they aren't provided,
      // but GraphQL may send 'undefined'. We can normalize the input here.
      const data = {
        ...input,
        role: input.role ?? null,
        phone: input.phone ?? null,
        hourlyRate: input.hourlyRate ?? null,
      };
      return prisma.user.create({ data });
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

