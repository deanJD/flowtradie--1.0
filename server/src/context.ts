import { PrismaClient, UserRole } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";

const prisma = new PrismaClient();

export interface GraphQLContext {
  prisma: PrismaClient;
  user?: { id: string; role: UserRole };
}

export function buildContext(req: any): GraphQLContext {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = token ? decodeToken(token) : undefined;
  return { prisma, user };
}
