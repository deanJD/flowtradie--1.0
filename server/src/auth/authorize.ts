import type { GraphQLContext } from "../context.js";
import { UserRole } from "@prisma/client";

export function requireAuth(ctx: GraphQLContext) {
  if (!ctx.user) {
    throw new Error("Not authenticated");
  }
}

export function requireOwnerOrAdmin(ctx: GraphQLContext) {
  requireAuth(ctx);
  if (ctx.user!.role !== UserRole.OWNER && ctx.user!.role !== UserRole.ADMIN) {
    throw new Error("Not authorized");
  }
}


