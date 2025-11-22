// server/src/services/business.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma, AddressType } from "@prisma/client";

export const businessService = {
  // -------------------------
  // 1) Get ALL businesses
  // -------------------------
  getAll: async (ctx: GraphQLContext) => {
    return ctx.prisma.business.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        region: true,
        address: true,
      },
    });
  },

  // -------------------------
  // 2) Get by ID
  // -------------------------
  getById: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.business.findUnique({
      where: { id, deletedAt: null },
      include: {
        region: true,
        address: true,
      },
    });
  },

  // -------------------------
  // 3) CREATE BUSINESS
  // -------------------------
  createBusiness: async (input: any, ctx: GraphQLContext) => {
    const {
      name,
      legalName,
      registrationNumber,
      email,
      phone,
      website,
      logoUrl,
      regionId,

      // address fields (optional)
      line1,
      line2,
      city,
      state,
      postcode,
      country,
    } = input;

    // create address only if provided
    let address = null;
    if (line1 || city || postcode) {
      address = await ctx.prisma.address.create({
        data: {
          addressType: AddressType.BUSINESS,
          line1,
          line2,
          city,
          state,
          postcode,
          country,
        },
      });
    }

    return ctx.prisma.business.create({
      data: {
        name,
        legalName,
        registrationNumber,
        email,
        phone,
        website,
        logoUrl,
        regionId,
        addressId: address?.id ?? null,
      },
      include: {
        region: true,
        address: true,
      },
    });
  },

  // -------------------------
  // 4) UPDATE BUSINESS
  // -------------------------
  updateBusiness: async (
    id: string,
    input: any,
    ctx: GraphQLContext
  ) => {
    const {
      name,
      legalName,
      registrationNumber,
      email,
      phone,
      website,
      logoUrl,
      regionId,

      // possible address edits
      line1,
      line2,
      city,
      state,
      postcode,
      country,
    } = input;

    const business = await ctx.prisma.business.findUnique({
      where: { id },
    });

    if (!business) throw new Error("Business not found");

    // update existing address OR create new one
    let addressId = business.addressId ?? null;

    if (addressId) {
      await ctx.prisma.address.update({
        where: { id: addressId },
        data: {
          line1,
          line2,
          city,
          state,
          postcode,
          country,
        },
      });
    } else if (line1 || city || postcode) {
      const newAddress = await ctx.prisma.address.create({
        data: {
          addressType: AddressType.BUSINESS,
          line1,
          line2,
          city,
          state,
          postcode,
          country,
        },
      });
      addressId = newAddress.id;
    }

    return ctx.prisma.business.update({
      where: { id },
      data: {
        name,
        legalName,
        registrationNumber,
        email,
        phone,
        website,
        logoUrl,
        regionId,
        addressId,
      },
      include: {
        region: true,
        address: true,
      },
    });
  },
};
