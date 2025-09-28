// This file contains all the business logic for handling TimeLog data.
export const timeLogResolvers = {
    Query: {
        timeLogsForJob: (_parent, { jobId }, { prisma }) => {
            return prisma.timeLog.findMany({
                where: { jobId },
                orderBy: { date: 'desc' },
            });
        },
        timeLogsForUser: (_parent, { userId }, { prisma }) => {
            return prisma.timeLog.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
            });
        },
    },
    Mutation: {
        createTimeLog: (_parent, { input }, { prisma }) => {
            return prisma.timeLog.create({ data: input });
        },
        updateTimeLog: (_parent, { id, input }, { prisma }) => {
            return prisma.timeLog.update({
                where: { id },
                data: input,
            });
        },
        deleteTimeLog: (_parent, { id }, { prisma }) => {
            return prisma.timeLog.delete({ where: { id } });
        },
    },
    // --- Relational Resolvers ---
    TimeLog: {
        job: (parent, _args, { prisma }) => {
            return prisma.job.findUnique({ where: { id: parent.jobId } });
        },
        user: (parent, _args, { prisma }) => {
            return prisma.user.findUnique({ where: { id: parent.userId } });
        },
    },
};
//# sourceMappingURL=timelog.js.map