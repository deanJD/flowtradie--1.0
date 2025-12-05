// server/src/services/client.service.ts
import { GraphQLContext } from "../context.js";

export const clientService = {
  // ============================================
  // GET ALL CLIENTS FOR BUSINESS (non-deleted)
  // ============================================
  getAll: async (_businessId: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) {
      throw new Error("User has no businessId");
    }

    return ctx.prisma.client.findMany({
      where: {
        businessId: ctx.user.businessId,
        deletedAt: null,
      },
      include: {
        addresses: true,
        projects: true,
        invoices: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // ============================================
  // GET CLIENT BY ID (non-deleted)
  // ============================================
  getById: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.client.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        addresses: true,
        projects: true,
        invoices: true,
      },
    });
  },

  // ============================================
  // CREATE CLIENT (✔ nested addresses)
  // ============================================
  create: async (input: any, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) {
      throw new Error("User has no businessId");
    }

    const { addresses, businessId: _discarded, ...rest } = input;

    return ctx.prisma.client.create({
      data: {
        ...rest,
        businessId: ctx.user.businessId, // always trust authenticated business ID

        // Nested address creation
        addresses: addresses?.length
          ? {
              create: addresses.map((addr: any) => ({
                addressType: addr.addressType ?? "CLIENT_BUSINESS",
                line1: addr.line1,
                line2: addr.line2 ?? null,
                city: addr.city,
                state: addr.state ?? null,
                postcode: addr.postcode,
                country: addr.country ?? null,
                countryCode: addr.countryCode ?? null,
              })),
            }
          : undefined,
      },

      include: {
        addresses: true,
        projects: true,
        invoices: true,
      },
    });
  },

  // ============================================
  // UPDATE CLIENT (✔ replace addresses if included)
  // ============================================
  update: async (id: string, input: any, ctx: GraphQLContext) => {
    const { addresses, businessId: _discarded, ...rest } = input;

    // If addresses are provided → full replace
    if (addresses && addresses.length > 0) {
      return ctx.prisma.client.update({
        where: { id },
        data: {
          ...rest,

          addresses: {
            deleteMany: {}, // remove all previous addresses

            create: addresses.map((addr: any) => ({
              addressType: addr.addressType ?? "CLIENT_BUSINESS",
              line1: addr.line1,
              line2: addr.line2 ?? null,
              city: addr.city,
              state: addr.state ?? null,
              postcode: addr.postcode,
              country: addr.country ?? null,
              countryCode: addr.countryCode ?? null,
            })),
          },
        },
        include: {
          addresses: true,
          projects: true,
          invoices: true,
        },
      });
    }

    // No addresses provided → update basic fields only
    return ctx.prisma.client.update({
      where: { id },
      data: rest,
      include: {
        addresses: true,
        projects: true,
        invoices: true,
      },
    });
  },
};
