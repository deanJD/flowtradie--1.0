// server/src/services/auth.service.ts
import { PrismaClient } from "@prisma/client";
import { encodeToken } from "../utils/jwt.js";
import { LoginInput, RegisterInput } from "@/__generated__/graphql.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authService = {
  // ---------------- SIGN-UP ----------------
  async register(input: RegisterInput) {
    const { name, email, password, regionCode } = input;

    // 1) Find Region
    const region = await prisma.region.findUnique({
      where: { code: regionCode },
    });
    if (!region) throw new Error(`Invalid region: ${regionCode}`);

    // 2) Atomic creation
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Create Business
      const business = await tx.business.create({
        data: {
          name, 
          email,
          legalName: name,
          region: { connect: { id: region.id } },
        },
      });

      // B. Create InvoiceSettings (NO tax fields)
      await tx.invoiceSettings.create({
        data: {
          businessId: business.id,
          invoicePrefix: "INV-",
          startingNumber: 1,
          defaultDueDays: 14,
        },
      });

      // C. Create User
      const hashed = await bcrypt.hash(password, 10);
      const user = await tx.user.create({
        data: {
          email,
          password: hashed,
          name,
          role: "OWNER",
          businessId: business.id,
        },
      });

      return { user, business };
    });

    // 3) Generate Token
    const token = encodeToken({
      id: result.user.id,
      role: result.user.role,
      businessId: result.business.id,
    });

    return { token, user: result.user };
  },

  // ---------------- SIGN-IN ----------------
  async login(input: LoginInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");

    const token = encodeToken({
      id: user.id,
      role: user.role,
      businessId: user.businessId,
    });

    return { token, user };
  },
};
