// src/context.ts
import { PrismaClient, UserRole } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
import { IncomingMessage } from "http";

const prisma = new PrismaClient();

// 🔥 Add businessId to user
export interface GraphQLContext {
  businessId: any;
  prisma: PrismaClient;
  user?: {
    id: string;
    role: UserRole;
    businessId: string;
  };
}

export function buildContext({ req }: { req: IncomingMessage }): GraphQLContext {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const decoded = token ? decodeToken(token) : null;

  return {
    businessId: decoded?.businessId ?? null,
    prisma,
    user: decoded
      ? {
          id: decoded.id,
          role: decoded.role,
          businessId: decoded.businessId, // 🚨 NEEDED FOR PAYMENTS/INVOICES
        }
      : undefined,
  };
}
