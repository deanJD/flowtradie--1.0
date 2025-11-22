// server/src/services/auth.service.ts

import { GraphQLContext } from "../context.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { LoginInput, RegisterInput } from "@/__generated__/graphql.js";
import { UserRole } from "@prisma/client";

export const authService = {
  // 🔹 Register → user becomes OWNER immediately
  async register(input: RegisterInput, ctx: GraphQLContext) {
    const { name, email, password } = input;

    // Check if email already exists
    const existing = await ctx.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (existing) {
      throw new Error("Email already in use.");
    }

    const hashedPassword = await hashPassword(password);

    // Create user as OWNER — but NO business yet
    const user = await ctx.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.OWNER,     // 🔥 OWNER immediately
        businessId: null,         // creates business after signup
      },
    });

    return user; // return only user – token comes AFTER business is added
  },

  // 🔹 Login
  async login(input: LoginInput, ctx: GraphQLContext) {
    const { email, password } = input;

    // Find active user
    const user = await ctx.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) throw new Error("Invalid credentials");

    const valid = await verifyPassword(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    // 🚨 Business is REQUIRED for full access (payments/invoices)
    if (!user.businessId) {
      throw new Error("No business linked to user. Please create a business first.");
    }

    // 🔐 Token now includes businessId
    const token = signToken({
      id: user.id,
      role: user.role,
      businessId: user.businessId,
    });

    return { token, user };
  },
};
