// server/src/services/reporting.service.ts

import { GraphQLContext } from '../context.js';
import { JobStatus, InvoiceStatus } from '@prisma/client';
import type { Job, Invoice, Payment, JobExpense, TimeLog, User } from '@prisma/client';

// Helper Types (these are great, we keep them)
type InvoiceWithPayments = Invoice & { payments: Payment[] };
type TimeLogWithUser = TimeLog & { user: User };

interface DashboardSummary {
  totalOpenJobs: number;
  invoicesDueSoon: number;
  tasksDueToday: number;
  totalRevenueYTD: number;
}

interface JobWithRelations extends Job {
  invoices: InvoiceWithPayments[];
  expenses: JobExpense[];
  timeLogs: TimeLogWithUser[];
}
interface JobProfitabilityResult {
  totalRevenue: number;
  totalMaterialCosts: number;
  totalLaborCosts: number;
  netProfit: number;
  job: JobWithRelations;
}

// CONVERTED FROM A CLASS TO A SIMPLE OBJECT
export const reportingService = {

  async getDashboardSummary(ctx: GraphQLContext): Promise<DashboardSummary> {
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

  async jobProfitability(jobId: string, ctx: GraphQLContext): Promise<JobProfitabilityResult> {
    const { prisma } = ctx; // Use prisma from the context

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        invoices: { include: { payments: true } },
        expenses: true,
        timeLogs: { include: { user: true } },
      },
    }) as JobWithRelations | null;

    if (!job) { throw new Error('Job not found'); }

    const totalRevenue = job.invoices.reduce((sum: number, invoice: InvoiceWithPayments) => {
      const invoiceTotal = invoice.payments.reduce((paymentSum: number, payment: Payment) => paymentSum + payment.amount, 0);
      return sum + invoiceTotal;
    }, 0);

    const totalMaterialCosts = job.expenses.reduce((sum: number, expense: JobExpense) => sum + expense.amount, 0);

    const totalLaborCosts = job.timeLogs.reduce((sum: number, timeLog: TimeLogWithUser) => {
      const rate = timeLog.user?.hourlyRate ?? 0;
      return sum + (timeLog.hoursWorked * rate);
    }, 0);

    const netProfit = totalRevenue - (totalMaterialCosts + totalLaborCosts);

    return { totalRevenue, totalMaterialCosts, totalLaborCosts, netProfit, job };
  }
};