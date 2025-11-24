// src/services/auth.service.ts
import { PrismaClient } from "@prisma/client";
import { encodeToken } from "../utils/jwt.js";  // 🔥 make sure this exports encodeToken
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

    // 2) Create Business FIRST (belongs to region)
    const business = await prisma.business.create({
      data: {
        name,
        email,
        legalName: name,
        region: { connect: { id: region.id } },
      },
    });

    // 3) Create OWNER USER
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        role: "OWNER",
        businessId: business.id,
      },
    });

    // 4) Payload + Token
    const token = encodeToken({
      id: user.id,
      role: user.role,
      businessId: user.businessId,
    });

    return { token, user };
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
