// server/src/services/reporting.service.ts
import { ProjectStatus, InvoiceStatus } from '@prisma/client';
export const reportingService = {
    async getDashboardSummary(ctx) {
        const { prisma } = ctx;
        const totalOpenProjects = await prisma.project.count({
            where: {
                status: {
                    in: [ProjectStatus.PENDING, ProjectStatus.ACTIVE],
                },
                deletedAt: null, // <-- CHANGED
            },
        });
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        const invoicesDueSoon = await prisma.invoice.count({
            where: {
                status: {
                    in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE, InvoiceStatus.PARTIALLY_PAID],
                },
                dueDate: {
                    lte: sevenDaysFromNow,
                },
                deletedAt: null, // <-- CHANGED
            },
        });
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const tasksDueToday = await prisma.task.count({
            where: {
                isCompleted: false,
                dueDate: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
                deletedAt: null, // <-- CHANGED
            }
        });
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const revenueRecords = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                date: {
                    gte: startOfYear,
                    lte: new Date(),
                },
                deletedAt: null, // <-- CHANGED
            },
        });
        const totalRevenueYTD = revenueRecords._sum.amount || 0;
        return { totalOpenProjects, invoicesDueSoon, tasksDueToday, totalRevenueYTD };
    },
    async projectProfitability(projectId, ctx) {
        const { prisma } = ctx;
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                deletedAt: null, // <-- CHANGED
            },
            include: {
                // Only include non-deleted child records for calculations
                invoices: {
                    where: { deletedAt: null }, // <-- CHANGED
                    include: {
                        payments: {
                            where: { deletedAt: null } // <-- CHANGED
                        }
                    }
                },
                expenses: {
                    where: { deletedAt: null } // <-- CHANGED
                },
                timeLogs: {
                    where: { deletedAt: null }, // <-- CHANGED
                    include: { user: true }
                },
            },
        });
        if (!project) {
            throw new Error('Project not found');
        }
        // The rest of your calculation logic is now automatically correct because
        // it's only receiving non-deleted records to sum up.
        const totalRevenue = project.invoices.reduce((sum, invoice) => {
            const invoiceTotal = invoice.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
            return sum + invoiceTotal;
        }, 0);
        const totalMaterialCosts = project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalLaborCosts = project.timeLogs.reduce((sum, timeLog) => {
            const rate = timeLog.user?.hourlyRate ?? 0;
            return sum + (timeLog.hoursWorked * rate);
        }, 0);
        const netProfit = totalRevenue - (totalMaterialCosts + totalLaborCosts);
        return { totalRevenue, totalMaterialCosts, totalLaborCosts, netProfit, project };
    }
};
//# sourceMappingURL=reporting.service.js.map