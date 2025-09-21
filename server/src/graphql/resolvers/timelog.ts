// This file contains all the business logic for handling TimeLog data.

import type { TimeLog, Job, User } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
interface CreateTimeLogInput {
  date: Date;
  hoursWorked: number;
  jobId: string;
  userId: string;
  notes?: string;
}

interface UpdateTimeLogInput {
  date?: Date;
  hoursWorked?: number;
  notes?: string;
}

export const timeLogResolvers = {
  Query: {
    timeLogsForJob: (
      _parent: unknown,
      { jobId }: { jobId: string },
      { prisma }: GraphQLContext
    ): Promise<TimeLog[]> => {
      return prisma.timeLog.findMany({
        where: { jobId },
        orderBy: { date: 'desc' },
      });
    },
    timeLogsForUser: (
      _parent: unknown,
      { userId }: { userId: string },
      { prisma }: GraphQLContext
    ): Promise<TimeLog[]> => {
      return prisma.timeLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      });
    },
  },
  Mutation: {
    createTimeLog: (
      _parent: unknown,
      { input }: { input: CreateTimeLogInput },
      { prisma }: GraphQLContext
    ): Promise<TimeLog> => {
      return prisma.timeLog.create({ data: input });
    },
    updateTimeLog: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateTimeLogInput },
      { prisma }: GraphQLContext
    ): Promise<TimeLog> => {
      return prisma.timeLog.update({
        where: { id },
        data: input,
      });
    },
    deleteTimeLog: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<TimeLog> => {
      return prisma.timeLog.delete({ where: { id } });
    },
  },

  // --- Relational Resolvers ---
  TimeLog: {
    job: (parent: TimeLog, _args: unknown, { prisma }: GraphQLContext): Promise<Job | null> => {
      return prisma.job.findUnique({ where: { id: parent.jobId } });
    },
    user: (parent: TimeLog, _args: unknown, { prisma }: GraphQLContext): Promise<User | null> => {
      return prisma.user.findUnique({ where: { id: parent.userId } });
    },
  },
};
