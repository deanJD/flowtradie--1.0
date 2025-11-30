// server/src/context.ts
import { PrismaClient, UserRole } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
import { IncomingMessage } from "http";

const prisma = new PrismaClient();

export interface GraphQLContext {
  prisma: PrismaClient;
  businessId: string | null;
  user: {
    id: string;
    email: string;
    role: UserRole;
    businessId: string | null;
  } | null;
}

export async function buildContext({ req }: { req: IncomingMessage }): Promise<GraphQLContext> {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ") && authHeader !== "Bearer null"
      ? authHeader.replace("Bearer ", "")
      : null;

  let decoded: any = null;
  let dbUser: any = null;

  if (token) {
    try {
      decoded = decodeToken(token);

      dbUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          businessId: true,   // ⚡ REQUIRED FOR PROJECTS / INVOICES / ALL
        },
      });
    } catch (e) {
      console.error("❌ Invalid JWT:", e);
    }
  }

  return {
    prisma,
    businessId: dbUser?.businessId ?? null, // ✔ NOW CONTEXT HAS IT
    user: dbUser,
  };
}
