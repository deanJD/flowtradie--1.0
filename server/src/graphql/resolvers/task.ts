// This file contains all the business logic for handling Task data.

import type { Task, Job, User } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
// Define interfaces for the mutation arguments to ensure type safety.
interface CreateTaskInput {
  title: string;
  jobId: string;
  description?: string;
  assignedToId?: string;
  dueDate?: Date;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  assignedToId?: string;
  dueDate?: Date;
}

export const taskResolvers = {
  Query: {
    tasks: (
      _parent: unknown,
      { jobId }: { jobId: string },
      { prisma }: GraphQLContext
    ): Promise<Task[]> => {
      return prisma.task.findMany({
        where: { jobId },
        orderBy: { createdAt: 'asc' },
      });
    },
    task: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Task | null> => {
      return prisma.task.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createTask: (
      _parent: unknown,
      { input }: { input: CreateTaskInput },
      { prisma }: GraphQLContext
    ): Promise<Task> => {
      return prisma.task.create({ data: input });
    },
    updateTask: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateTaskInput },
      { prisma }: GraphQLContext
    ): Promise<Task> => {
      return prisma.task.update({
        where: { id },
        data: input,
      });
    },
    deleteTask: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Task> => {
      return prisma.task.delete({ where: { id } });
    },
  },

  // --- Relational Resolvers ---
  // These functions run only when a query specifically asks for a Task's related data.
  Task: {
    job: (parent: Task, _args: unknown, { prisma }: GraphQLContext): Promise<Job | null> => {
      // The `parent` argument is the Task object from the initial query.
      return prisma.job.findUnique({ where: { id: parent.jobId } });
    },
    assignedTo: async (
      parent: Task,
      _args: unknown,
      { prisma }: GraphQLContext
    ): Promise<User | null> => {
      // If there's no assigned user, return null immediately.
      if (!parent.assignedToId) {
        return null;
      }
      return prisma.user.findUnique({ where: { id: parent.assignedToId } });
    },
  },
};
