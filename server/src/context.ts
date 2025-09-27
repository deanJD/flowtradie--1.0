import { PrismaClient } from "@prisma/client";
import { decodeToken } from "./utils/jwt";

const prisma = new PrismaClient();

export async function buildContext(req: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = token ? decodeToken(token) : null;

  return { prisma, user };
}
