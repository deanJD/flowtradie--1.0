// This file contains all the business logic for user authentication.

import type { User, UserRole } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// This is a secret key for signing the JWT. In a real production app,
// this should be stored securely in your .env file.
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const SALT_ROUNDS = 10;

export const authResolvers = {
  Mutation: {
    register: async (
      _parent: unknown,
      args: { email: string; password: string; name: string; role?: UserRole },
      { prisma }: GraphQLContext
    ) => {
      // 1. Hash the user's password for security.
      const hashedPassword = await bcrypt.hash(args.password, SALT_ROUNDS);

      // 2. Create the new user in the database.
      const user = await prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
          name: args.name,
          role: args.role, // Will use the default 'WORKER' if not provided
        },
      });

      // 3. Create a JWT "digital ID card" for the new user.
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '7d', // Token will be valid for 7 days
      });

      // 4. Return the token and the user's data.
      return {
        token,
        user,
      };
    },

    login: async (
      _parent: unknown,
      { email, password }: { email: string; password: string },
      { prisma }: GraphQLContext
    ) => {
      // 1. Find the user by their email.
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('Invalid login credentials');
      }

      // 2. Compare the provided password with the stored hash.
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new Error('Invalid login credentials');
      }

      // 3. If the password is valid, create a new JWT.
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // 4. Return the token and the user's data.
      return {
        token,
        user,
      };
    },
  },
};
