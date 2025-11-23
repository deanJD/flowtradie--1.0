import { GraphQLContext } from '../context.js';
import { ProjectStatus, InvoiceStatus } from '@prisma/client';
import type { Project, Invoice, Payment, ProjectExpense, TimeLog, User } from '@prisma/client';

// Helper Types
type InvoiceWithPayments = Invoice & { payments: Payment[] };
type TimeLogWithUser = TimeLog & { user: User };

interface DashboardSummary {
  totalOpenProjects: number;
  invoicesDueSoon: number;
  tasksDueToday: number;
  totalRevenueYTD: number;
}

interface ProjectWithRelations extends Project {
  invoices: InvoiceWithPayments[];
  expenses: ProjectExpense[];
  timeLogs: TimeLogWithUser[];
}
interface ProjectProfitabilityResult {
  totalRevenue: number;
  totalMaterialCosts: number;
  totalLaborCosts: number;
  netProfit: number;
  project: ProjectWithRelations;
}

export const reportingService = {

  async getDashboardSummary(ctx: GraphQLContext): Promise<DashboardSummary> {
    const { prisma, user } = ctx;
    
    // Ensure we scope to the user's business
    const businessId = user?.businessId;
    if (!businessId) throw new Error("Authenticated user required");

    const totalOpenProjects = await prisma.project.count({
      where: {
        businessId, // Scope to business
        status: { in: [ProjectStatus.PENDING, ProjectStatus.ACTIVE] },
        deletedAt: null,
      },
    });

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const invoicesDueSoon = await prisma.invoice.count({
      where: {
        businessId, // Scope to business
        status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE, InvoiceStatus.PARTIALLY_PAID] },
        dueDate: { lte: sevenDaysFromNow },
        deletedAt: null,
      },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const tasksDueToday = await prisma.task.count({
      where: {
        businessId, // Scope to business
        isCompleted: false,
        dueDate: { gte: startOfToday, lte: endOfToday },
        deletedAt: null,
      }
    });
    
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    
    const revenueRecords = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        businessId, // Scope to business
        date: { gte: startOfYear, lte: new Date() },
        deletedAt: null,
      },
    });

    // FIX: Convert Decimal to number
    const totalRevenueYTD = revenueRecords._sum && revenueRecords._sum.amount
      ? revenueRecords._sum.amount.toNumber()
      : 0;

    return { totalOpenProjects, invoicesDueSoon, tasksDueToday, totalRevenueYTD };
  },
  
  async projectProfitability(projectId: string, ctx: GraphQLContext): Promise<ProjectProfitabilityResult> {
    const { prisma } = ctx;

    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        deletedAt: null,
      },
      include: {
        invoices: { 
          where: { deletedAt: null },
          include: { 
            payments: { where: { deletedAt: null } } 
          } 
        },
        expenses: { where: { deletedAt: null } },
        timeLogs: { 
          where: { deletedAt: null },
          include: { user: true } 
        },
      },
    }) as ProjectWithRelations | null;
    
    if (!project) { throw new Error('Project not found'); }

    // FIX: Use .toNumber() for all math operations
    const totalRevenue = project.invoices.reduce((sum: number, invoice: InvoiceWithPayments) => {
      const invoiceTotal = invoice.payments.reduce((paymentSum: number, payment: Payment) => 
        paymentSum + payment.amount.toNumber(), 0);
      return sum + invoiceTotal;
    }, 0);

    const totalMaterialCosts = project.expenses.reduce((sum: number, expense: ProjectExpense) => 
      sum + expense.amount.toNumber(), 0);

    const totalLaborCosts = project.timeLogs.reduce((sum: number, timeLog: TimeLogWithUser) => {
      const rate = timeLog.user?.hourlyRate?.toNumber() ?? 0;
      // Convert hoursWorked (Decimal) to number
      return sum + (timeLog.hoursWorked.toNumber() * rate);
    }, 0);
    
    const netProfit = totalRevenue - (totalMaterialCosts + totalLaborCosts);

    return { totalRevenue, totalMaterialCosts, totalLaborCosts, netProfit, project };
  }
};