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

  console.log("🧾 RAW TOKEN:", token);

  let decoded: any = null;
  let dbUser: any = null;

  if (token) {
    try {
      decoded = decodeToken(token);
      console.log("🧠 Decoded user:", decoded);

      // 🔥 FETCH REAL USER FROM DATABASE
      dbUser = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!dbUser) {
        console.log("❌ No user found in DB.");
      }
    } catch (e) {
      console.error("❌ Invalid JWT:", e);
    }
  }

  return {
    prisma,
    businessId: decoded?.businessId ?? null,
    user: dbUser
      ? {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          businessId: dbUser.businessId,
        }
      : null,  // 🧠 MUST BE NULL if NOT LOGGED IN!
  };
}
