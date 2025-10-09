// server/src/services/project.service.ts
export const projectService = {
    // Find all projects, including their client
    getAll: (clientId, ctx) => {
        // Build the "where" clause to only find non-deleted projects
        const where = {
            deletedAt: null, // <-- THIS IS THE FIX
        };
        if (clientId) {
            where.clientId = clientId;
        }
        return ctx.prisma.project.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { client: true },
        });
    },
    // Find a single non-deleted project by its ID
    getById: (id, ctx) => {
        return ctx.prisma.project.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                client: true,
                tasks: true,
                quotes: true,
                invoices: true,
            },
        });
    },
    // Create a new project
    create: (input, ctx) => {
        const data = {
            title: input.title,
            description: input.description ?? undefined,
            location: input.location ?? undefined,
            status: input.status ?? undefined,
            startDate: input.startDate ?? undefined,
            endDate: input.endDate ?? undefined,
            client: { connect: { id: input.clientId } },
            manager: input.managerId ? { connect: { id: input.managerId } } : undefined,
        };
        return ctx.prisma.project.create({
            data,
            include: { client: true },
        });
    },
    // Update a project
    update: (id, input, ctx) => {
        const data = {
            title: input.title ?? undefined,
            description: input.description ?? undefined,
            location: input.location ?? undefined,
            status: input.status ?? undefined,
            startDate: input.startDate ?? undefined,
            endDate: input.endDate ?? undefined,
            budgetedAmount: input.budgetedAmount ?? undefined,
            manager: input.managerId === null
                ? { disconnect: true }
                : input.managerId
                    ? { connect: { id: input.managerId } }
                    : undefined,
        };
        return ctx.prisma.project.update({
            where: { id },
            data,
            include: { client: true },
        });
    },
    // "Delete" a project (now a soft delete)
    delete: (id, ctx) => {
        return ctx.prisma.project.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=project.service.js.map