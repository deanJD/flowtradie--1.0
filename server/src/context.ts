// src/context.ts
import { PrismaClient, UserRole } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
import { IncomingMessage } from "http"; // ✅ this fixes the type issue

const prisma = new PrismaClient();

export interface GraphQLContext {
  prisma: PrismaClient;
  user?: { id: string; role: UserRole };
}

// ✅ Explicitly type req as IncomingMessage
export function buildContext({ req }: { req: IncomingMessage }): GraphQLContext {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const decoded = token ? decodeToken(token) : null;

  return {
    prisma,
    user: decoded ? { id: decoded.id, role: decoded.role } : undefined,
  };
}
