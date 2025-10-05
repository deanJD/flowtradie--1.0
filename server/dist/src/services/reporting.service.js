// server/src/services/reporting.service.ts
import { ProjectStatus, InvoiceStatus } from '@prisma/client';
// CONVERTED FROM A CLASS TO A SIMPLE OBJECT
export const reportingService = {
    async getDashboardSummary(ctx) {
        const { prisma } = ctx; // Use prisma from the context
        const totalOpenProjects = await prisma.project.count({
            where: {
                status: {
                    in: [ProjectStatus.PENDING, ProjectStatus.ACTIVE],
                },
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
                }
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
            },
        });
        const totalRevenueYTD = revenueRecords._sum.amount || 0;
        return { totalOpenProjects, invoicesDueSoon, tasksDueToday, totalRevenueYTD };
    },
    async projectProfitability(projectId, ctx) {
        const { prisma } = ctx; // Use prisma from the context
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                invoices: { include: { payments: true } },
                expenses: true,
                timeLogs: { include: { user: true } },
            },
        });
        if (!project) {
            throw new Error('Project not found');
        }
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