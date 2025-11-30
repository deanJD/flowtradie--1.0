// server/src/services/client.service.ts
import { GraphQLContext } from "../context.js";

export const clientService = {
  // 🔹 Get all clients for the logged-in user's business
  getAll: async (_businessId: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) {
      throw new Error("User has no businessId");
    }

    return ctx.prisma.client.findMany({
      where: { businessId: ctx.user.businessId },
      include: {
        addresses: true,
        projects: true,
      },
    });
  },

  // 🔹 Get single client by ID (with addresses + projects)
  getById: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.client.findUnique({
      where: { id },
      include: {
        addresses: true,
        projects: true,
      },
    });
  },

  // 🔹 Create client (WITH nested addresses)
  create: async (input: any, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) {
      throw new Error("User has no businessId");
    }

    const { addresses, businessId: _ignoredBusinessId, ...rest } = input;

    return ctx.prisma.client.create({
      data: {
        ...rest,
        businessId: ctx.user.businessId, // always use logged-in business

        // ⭐ Proper Prisma nested create for addresses
        addresses: addresses?.length
          ? {
              create: addresses.map((addr: any) => ({
                addressType: addr.addressType ?? "CLIENT_BUSINESS",
                line1: addr.line1,
                line2: addr.line2,
                city: addr.city,
                state: addr.state,
                postcode: addr.postcode,
                country: addr.country,
                countryCode: addr.countryCode,
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

  // 🔹 Update client (for now: basic fields only, no address update)
  update: async (id: string, input: any, ctx: GraphQLContext) => {
    const { addresses: _ignoredAddresses, businessId: _ignoredBusinessId, ...rest } = input;

    return ctx.prisma.client.update({
      where: { id },
      data: rest,
    });
  },
};
