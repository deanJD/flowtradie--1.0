// server/src/services/project.service.ts
export const projectService = {
    // Find all projects, including their client
    getAll: (clientId, ctx) => {
        // 1. Build the base "where" clause to only find non-deleted projects
        const where = {
            deletedAt: null,
        };
        // 2. If a clientId is provided, add it to the filter
        if (clientId) {
            where.clientId = clientId;
        }
        return ctx.prisma.project.findMany({
            where, // <-- CHANGED: Use our new where clause
            orderBy: { createdAt: "desc" },
            include: { client: true },
        });
    },
    // Find a single non-deleted project by its ID
    getById: (id, ctx) => {
        // CHANGED: We use 'findFirst' here instead of 'findUnique'. This allows us to
        // add the 'deletedAt: null' check to ensure we don't accidentally fetch a deleted project.
        return ctx.prisma.project.findFirst({
            where: {
                id,
                deletedAt: null, // <-- CHANGED: Only find if not deleted
            },
            include: {
                client: true,
                tasks: true,
                quotes: true,
                invoices: true,
            },
        });
    },
    // Create a new project (no changes needed here)
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
    // Update a project (no changes needed here)
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
        // CHANGED: Instead of deleting, we now UPDATE the record
        return ctx.prisma.project.update({
            where: { id },
            data: {
                deletedAt: new Date(), // Set the 'deletedAt' timestamp to now
            },
        });
    },
};
//# sourceMappingURL=project.service.js.map