// This file contains the business logic for generating financial reports.

import { GraphQLContext } from '../../prisma/client.js';

export const reportingResolvers = {
  Query: {
    jobProfitability: async (
      _parent: unknown,
      { jobId }: { jobId: string },
      { prisma }: GraphQLContext
    ) => {
      // 1. Fetch the job and all its related financial data in one efficient query.
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

      // 2. Calculate Total Revenue from all payments.
      const totalRevenue = job.invoices.reduce((sum, invoice) => {
        const invoiceTotal = invoice.payments.reduce((paymentSum, payment) => {
          return paymentSum + payment.amount;
        }, 0);
        return sum + invoiceTotal;
      }, 0);

      // 3. Calculate Total Material Costs from all expenses.
      const totalMaterialCosts = job.expenses.reduce((sum, expense) => {
        return sum + expense.amount;
      }, 0);

      // 4. Calculate Total Labor Costs from all time logs and user hourly rates.
      const totalLaborCosts = job.timeLogs.reduce((sum, timeLog) => {
        // Default to an hourly rate of 0 if not set on the user.
        const rate = timeLog.user.hourlyRate ?? 0;
        const cost = timeLog.hoursWorked * rate;
        return sum + cost;
      }, 0);
      
      // 5. Calculate the final Net Profit.
      const netProfit = totalRevenue - (totalMaterialCosts + totalLaborCosts);

      // 6. Return the complete, calculated report.
      return {
        totalRevenue,
        totalMaterialCosts,
        totalLaborCosts,
        netProfit,
        job,
      };
    },
  },
};

