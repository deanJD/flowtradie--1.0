// server/src/context.ts
import { PrismaClient, UserRole } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
import { IncomingMessage } from "http";
import { JwtPayload } from "jsonwebtoken"; 

const prisma = new PrismaClient();

// 1️⃣ DEFINE YOUR TOKEN SHAPE
// This ensures you know exactly what is inside your JWT
interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

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

  let dbUser = null;

  if (token) {
    try {
      // 2️⃣ SAFE CASTING
      const decoded = decodeToken(token) as unknown as AuthTokenPayload;

      // Ensure the token actually has an ID before hitting the DB
      if (decoded && decoded.id) {
        dbUser = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            role: true,
            businessId: true,
          },
        });
      }
    } catch (e) {
      // 3️⃣ SILENT FAILURE LOGGING (Don't crash, just warn)
      console.warn("⚠️ Auth Warning: Invalid or Expired JWT received");
    }
  }

  return {
    prisma,
    businessId: dbUser?.businessId ?? null,
    user: dbUser,
  };
}