// server/src/services/reporting.service.ts
import { JobStatus, InvoiceStatus } from '@prisma/client';
// CONVERTED FROM A CLASS TO A SIMPLE OBJECT
export const reportingService = {
    async getDashboardSummary(ctx) {
        const { prisma } = ctx; // Use prisma from the context
        const totalOpenJobs = await prisma.job.count({
            where: {
                status: {
                    in: [JobStatus.PENDING, JobStatus.ACTIVE],
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
        return { totalOpenJobs, invoicesDueSoon, tasksDueToday, totalRevenueYTD };
    },
    async jobProfitability(jobId, ctx) {
        const { prisma } = ctx; // Use prisma from the context
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                invoices: { include: { payments: true } },
                expenses: true,
                timeLogs: { include: { user: true } },
            },
        });
        if (!job) {
            throw new Error('Job not found');
        }
        const totalRevenue = job.invoices.reduce((sum, invoice) => {
            const invoiceTotal = invoice.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
            return sum + invoiceTotal;
        }, 0);
        const totalMaterialCosts = job.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalLaborCosts = job.timeLogs.reduce((sum, timeLog) => {
            const rate = timeLog.user?.hourlyRate ?? 0;
            return sum + (timeLog.hoursWorked * rate);
        }, 0);
        const netProfit = totalRevenue - (totalMaterialCosts + totalLaborCosts);
        return { totalRevenue, totalMaterialCosts, totalLaborCosts, netProfit, job };
    }
};
//# sourceMappingURL=reporting.service.js.map