// src/utils/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // CHANGE LATER

// ---- Decode Token ----
export function decodeToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    id: string;
    role: string;
    businessId: string | null;
  };
}

// ---- Encode Token ----
export function encodeToken(payload: { id: string; role: string; businessId: string | null }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
