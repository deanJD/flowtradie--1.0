// server/src/services/auth.service.ts
import { GraphQLContext } from "../context.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { LoginInput, RegisterInput } from "@/__generated__/graphql.js";
import { UserRole } from "@prisma/client";

export const authService = {
  // 🔹 Register a new user (NO business yet)
  async register(input: RegisterInput, ctx: GraphQLContext) {
    const { name, email, password } = input;

    // Check if active user exists
    const existing = await ctx.prisma.user.findFirst({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new Error("Email already in use.");
    }

    const hashedPassword = await hashPassword(password);

    // Create a user WITHOUT businessId
    const user = await ctx.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.WORKER, // 🔥 user is OWNER only AFTER creating a business
        business: undefined, // or null, depending on your Prisma schema
      },
    });

    return user;
  },

  // 🔹 Login
  async login(input: LoginInput, ctx: GraphQLContext) {
    const { email, password } = input;

    // Find active user
    const user = await ctx.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null, // keep if you still use soft delete
      },
    });

    if (!user) throw new Error("Invalid credentials");

    const valid = await verifyPassword(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    // Include businessId in the JWT
    const token = signToken({
      id: user.id,
      role: user.role,
      businessId: user.businessId ?? null,
    });

    return {
      token,
      user,
    };
  },
};
