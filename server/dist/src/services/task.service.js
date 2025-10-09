import { Prisma } from "@prisma/client";
// Define the 'include' object once to keep our code DRY
const taskInclude = {
    assignedTo: true,
    project: true,
};
export const taskService = {
    getAllByProject: (projectId, ctx) => {
        return ctx.prisma.task.findMany({
            where: {
                projectId,
                deletedAt: null, // <-- CHANGED
            },
            orderBy: { createdAt: "desc" },
            include: taskInclude,
        });
    },
    getById: (id, ctx) => {
        // CHANGED: Use findFirst to ensure we don't fetch a deleted task
        return ctx.prisma.task.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: taskInclude,
        });
    },
    create: async (input, ctx) => {
        try {
            return await ctx.prisma.task.create({
                data: input,
                include: taskInclude,
            });
        }
        catch (error) {
            // Keep your excellent error handling for invalid foreign keys
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
                throw new Error("Invalid projectId or assignedToId. The Project or User does not exist.");
            }
            throw error;
        }
    },
    update: (id, input, ctx) => {
        // Manually build the data object to handle nulls and relations
        const data = {
            title: input.title ?? undefined,
            description: input.description ?? undefined,
            isCompleted: input.isCompleted ?? undefined,
            dueDate: input.dueDate ?? undefined,
            assignedTo: input.assignedToId === null
                ? { disconnect: true }
                : input.assignedToId
                    ? { connect: { id: input.assignedToId } }
                    : undefined,
        };
        return ctx.prisma.task.update({
            where: { id },
            data: data,
            include: taskInclude,
        });
    },
    delete: (id, ctx) => {
        // CHANGED: This is now a soft delete
        return ctx.prisma.task.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=task.service.js.map