// server/src/services/project.service.ts
export const projectService = {
    /** ------------------------- 🔍 Get ALL projects ------------------------- */
    getAll: (clientId, ctx) => {
        console.log("DEBUG getAll ctx.user =", ctx.user, "ctx.businessId =", ctx.businessId);
        if (!ctx.user?.businessId)
            throw new Error("Unauthorized");
        const where = {
            deletedAt: null,
            businessId: ctx.user.businessId, // 🔥 MUST FILTER BY BUSINESS
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
    /** ------------------------- 🔎 Get ONE project ------------------------- */
    getById: (id, ctx) => {
        if (!ctx.user?.businessId)
            throw new Error("Unauthorized");
        return ctx.prisma.project.findFirst({
            where: { id, deletedAt: null, businessId: ctx.user.businessId },
            include: {
                client: true,
                tasks: true,
                quotes: true,
                invoices: true,
                timeLogs: true,
                expenses: true,
            },
        });
    },
    /** ------------------------- 🆕 Create project ------------------------- */
    create: (input, ctx) => {
        if (!ctx.user?.businessId)
            throw new Error("Unauthorized");
        return ctx.prisma.project.create({
            data: {
                business: { connect: { id: ctx.user.businessId } },
                client: { connect: { id: input.clientId } },
                manager: input.managerId ? { connect: { id: input.managerId } } : undefined,
                title: input.title,
                description: input.description ?? undefined,
                location: input.location ?? undefined,
                status: input.status ?? undefined,
                startDate: input.startDate ?? undefined,
                endDate: input.endDate ?? undefined,
            },
            include: { client: true },
        });
    },
    /** ------------------------- 🔁 Update project ------------------------- */
    update: (id, input, ctx) => {
        if (!ctx.user?.businessId)
            throw new Error("Unauthorized");
        return ctx.prisma.project.update({
            where: { id },
            data: {
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
            },
            include: { client: true },
        });
    },
    /** ------------------------- 🗑 Soft delete ------------------------- */
    delete: (id, ctx) => {
        if (!ctx.user?.businessId)
            throw new Error("Unauthorized");
        return ctx.prisma.project.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
    /** ------------------------- 🔗 RELATION FETCHERS ------------------------- */
    getClient: (projectId, ctx) => ctx.prisma.client.findFirst({ where: { projects: { some: { id: projectId } } } }),
    getInvoices: (projectId, ctx) => ctx.prisma.invoice.findMany({ where: { projectId, deletedAt: null } }),
    getQuotes: (projectId, ctx) => ctx.prisma.quote.findMany({ where: { projectId, deletedAt: null } }),
    getTasks: (projectId, ctx) => ctx.prisma.task.findMany({ where: { projectId, deletedAt: null } }),
    getExpenses: (projectId, ctx) => ctx.prisma.projectExpense.findMany({ where: { projectId, deletedAt: null } }),
    getTimeLogs: (projectId, ctx) => ctx.prisma.timeLog.findMany({ where: { projectId, deletedAt: null } }),
    /** ------------------------- 📊 PROJECT REPORTING ------------------------- */
    getFinancialSummary: async (projectId, ctx) => {
        if (!ctx.user?.businessId)
            throw new Error("Unauthorized");
        const [invoices, payments, expenses, timeLogs] = await Promise.all([
            ctx.prisma.invoice.aggregate({
                where: { projectId, deletedAt: null },
                _sum: { totalAmount: true },
            }),
            ctx.prisma.payment.aggregate({
                where: { invoice: { projectId }, deletedAt: null },
                _sum: { amount: true },
            }),
            ctx.prisma.projectExpense.aggregate({
                where: { projectId, deletedAt: null },
                _sum: { amount: true },
            }),
            ctx.prisma.timeLog.aggregate({
                where: { projectId, deletedAt: null },
                _sum: { hoursWorked: true },
            }),
        ]);
        return {
            invoicesTotal: invoices._sum.totalAmount ?? 0,
            paymentsTotal: payments._sum.amount ?? 0,
            expensesTotal: expenses._sum.amount ?? 0,
            hoursWorked: timeLogs._sum.hoursWorked ?? 0,
            estimatedProfit: Number(invoices._sum.totalAmount ?? 0) -
                Number(expenses._sum.amount ?? 0),
        };
    },
};
//# sourceMappingURL=project.service.js.map