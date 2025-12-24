import { GraphQLContext } from "../context.js";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/__generated__/graphql.js";
import { AddressType } from "@prisma/client";

export const projectService = {
  /** ------------------------------------------------------------------
   *  🔍 GET ALL PROJECTS (No args — filtered automatically by tenant)
   *  ------------------------------------------------------------------ */
  getAll: async (ctx: GraphQLContext) => {
    if (!ctx.user || !ctx.businessId) {
      throw new Error("Unauthorized");
    }

    return ctx.prisma.project.findMany({
      where: {
        businessId: ctx.businessId!,
        deletedAt: null,
      },
      orderBy: { createdAt: "asc" },
      include: {
        client: true,
        // add this later if you want addresses in list APIs
        // siteAddress: true,
      },
    });
  },

  /** ------------------------------------------------------------------
   *  🔎 GET ONE PROJECT BY ID
   *  ------------------------------------------------------------------ */
  getById: (id: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    return ctx.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
        businessId: ctx.businessId!,
      },
      include: {
        client: true,
        tasks: true,
        quotes: true,
        invoices: true,
        timeLogs: true,
        expenses: true,
        siteAddress: true, // 👈 include the related address
      },
    });
  },

  /** ------------------------------------------------------------------
   *  🆕 CREATE PROJECT
   *  ------------------------------------------------------------------ */
  create: async (input: CreateProjectInput, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    const { siteAddress, ...rest } = input;

    // If siteAddress was provided, create it first
    let siteAddressConnect:
      | {
          connect: { id: string };
        }
      | undefined;

    if (siteAddress) {
      const createdAddress = await ctx.prisma.address.create({
        data: {
          addressType: AddressType.SITE,
          line1: siteAddress.line1,
          line2: siteAddress.line2 ?? null,
          city: siteAddress.city,
          state: siteAddress.state ?? null,
          postcode: siteAddress.postcode,
          country: siteAddress.country ?? null,
          countryCode: siteAddress.countryCode ?? null,
        },
      });

      siteAddressConnect = { connect: { id: createdAddress.id } };
    }

    return ctx.prisma.project.create({
      data: {
        business: { connect: { id: ctx.businessId! } },
        client: { connect: { id: rest.clientId } },

        manager: rest.managerId
          ? { connect: { id: rest.managerId } }
          : undefined,

        title: rest.title,
        description: rest.description ?? undefined,
        status: rest.status ?? undefined,
        startDate: rest.startDate ?? undefined,
        endDate: rest.endDate ?? undefined,

        // 👇 use relation, NOT siteAddressId scalar
        siteAddress: siteAddressConnect,
      },
      include: { client: true, siteAddress: true },
    });
  },

  /** ------------------------------------------------------------------
   *  🔁 UPDATE PROJECT
   *  ------------------------------------------------------------------ */
  update: async (id: string, input: UpdateProjectInput, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    const { siteAddress, ...rest } = input;

    // We may or may not need to change the relation
    let siteAddressRelation:
      | {
          connect: { id: string };
        }
      | undefined;

    if (siteAddress) {
      // Does the project already have a site address?
      const existing = await ctx.prisma.project.findUnique({
        where: { id },
        select: { siteAddressId: true },
      });

      if (existing?.siteAddressId) {
        // Update existing address only – no need to change relation
        await ctx.prisma.address.update({
          where: { id: existing.siteAddressId },
          data: {
            line1: siteAddress.line1,
            line2: siteAddress.line2 ?? null,
            city: siteAddress.city,
            state: siteAddress.state ?? null,
            postcode: siteAddress.postcode,
            country: siteAddress.country ?? null,
            countryCode: siteAddress.countryCode ?? null,
          },
        });
        // relation already points at this address
      } else {
        // No address yet -> create one and connect it
        const createdAddress = await ctx.prisma.address.create({
          data: {
            addressType: AddressType.SITE,
            line1: siteAddress.line1,
            line2: siteAddress.line2 ?? null,
            city: siteAddress.city,
            state: siteAddress.state ?? null,
            postcode: siteAddress.postcode,
            country: siteAddress.country ?? null,
            countryCode: siteAddress.countryCode ?? null,
          },
        });

        siteAddressRelation = { connect: { id: createdAddress.id } };
      }
    }

    return ctx.prisma.project.update({
      where: { id },
      data: {
        title: rest.title ?? undefined,
        description: rest.description ?? undefined,
        status: rest.status ?? undefined,
        startDate: rest.startDate ?? undefined,
        endDate: rest.endDate ?? undefined,
        budgetedAmount: rest.budgetedAmount ?? undefined,

        ...(siteAddressRelation ? { siteAddress: siteAddressRelation } : {}),

        manager:
          rest.managerId === null
            ? { disconnect: true }
            : rest.managerId
            ? { connect: { id: rest.managerId } }
            : undefined,
      },
      include: { client: true, siteAddress: true },
    });
  },

  /** ------------------------------------------------------------------
   *  🗑 SOFT DELETE PROJECT
   *  ------------------------------------------------------------------ */
  delete: (id: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    return ctx.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  /** ------------------------------------------------------------------
   *  🔗 RELATION FETCHERS
   *  ------------------------------------------------------------------ */
  getClient: (projectId: string, ctx: GraphQLContext) =>
    ctx.prisma.client.findFirst({
      where: { projects: { some: { id: projectId } } },
    }),

  getInvoices: (projectId: string, ctx: GraphQLContext) =>
    ctx.prisma.invoice.findMany({
      where: { projectId, deletedAt: null },
    }),

  getQuotes: (projectId: string, ctx: GraphQLContext) =>
    ctx.prisma.quote.findMany({
      where: { projectId, deletedAt: null },
    }),

  getTasks: (projectId: string, ctx: GraphQLContext) =>
    ctx.prisma.task.findMany({
      where: { projectId, deletedAt: null },
    }),

  getExpenses: (projectId: string, ctx: GraphQLContext) =>
    ctx.prisma.projectExpense.findMany({
      where: { projectId, deletedAt: null },
    }),

  getTimeLogs: (projectId: string, ctx: GraphQLContext) =>
    ctx.prisma.timeLog.findMany({
      where: { projectId, deletedAt: null },
    }),

  /** ------------------------------------------------------------------
   *  📊 FINANCIAL SUMMARY REPORTING
   *  ------------------------------------------------------------------ */
  getFinancialSummary: async (projectId: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

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
      estimatedProfit:
        Number(invoices._sum.totalAmount ?? 0) -
        Number(expenses._sum.amount ?? 0),
    };
  },
};
