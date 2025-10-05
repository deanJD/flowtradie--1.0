// server/src/services/project.service.ts
export const projectService = {
    // Find all projects, including their client
    getAll: (clientId, ctx) => {
        return ctx.prisma.project.findMany({
            where: clientId ? { clientId } : {},
            orderBy: { createdAt: "desc" },
            include: { client: true },
        });
    },
    // Inside your project.service.ts file
    getById: (id, ctx) => {
        return ctx.prisma.project.findUnique({
            where: { id },
            include: {
                client: true,
                tasks: true, // <-- This is the main fix
                quotes: true, // <-- Added to prevent the next error
                invoices: true, // <-- Added to prevent the next error
            },
        });
    },
    // Create a new project
    create: (input, ctx) => {
        // FIX #1: Manually build the data object to handle relations
        // and to convert potential nulls to undefined.
        const data = {
            title: input.title,
            description: input.description ?? undefined,
            location: input.location ?? undefined,
            status: input.status ?? undefined,
            startDate: input.startDate ?? undefined,
            endDate: input.endDate ?? undefined,
            // Connect relations properly
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
        // FIX #2: Handle the manager relation correctly using connect/disconnect
        // and clean all other nullable fields.
        const data = {
            title: input.title ?? undefined,
            description: input.description ?? undefined,
            location: input.location ?? undefined,
            status: input.status ?? undefined,
            startDate: input.startDate ?? undefined,
            endDate: input.endDate ?? undefined,
            budgetedAmount: input.budgetedAmount ?? undefined,
            // Handle the manager relation update
            manager: input.managerId === null
                ? { disconnect: true } // If managerId is explicitly null, disconnect it
                : input.managerId
                    ? { connect: { id: input.managerId } } // If an ID is provided, connect it
                    : undefined, // Otherwise, do nothing
        };
        return ctx.prisma.project.update({
            where: { id },
            data,
            include: { client: true },
        });
    },
    // Delete a project
    delete: (id, ctx) => {
        return ctx.prisma.project.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=project.service.js.map