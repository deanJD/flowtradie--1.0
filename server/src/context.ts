// src/context.ts
import { PrismaClient, UserRole } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
import { IncomingMessage } from "http";

const prisma = new PrismaClient();

export interface GraphQLContext {
  prisma: PrismaClient;
  businessId: string | null;     // 👈 ADD THIS
  user?: {
    id: string;
    role: UserRole;
    businessId: string | null;   // 👈 We MUST allow null here
  };
}

export function buildContext({ req }: { req: IncomingMessage }): GraphQLContext {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const decoded = token ? decodeToken(token) : null;

  return {
    prisma,
    businessId: decoded?.businessId ?? null, // 👈 ALWAYS SET THIS
    user: decoded
      ? {
          id: decoded.id,
          role: decoded.role as UserRole,
          businessId: decoded.businessId ?? null,
        }
      : undefined,
  };
}
