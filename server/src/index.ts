// This is the main entry point for the entire application.
// It is now fully secured with JWT authentication.

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { mergeTypeDefs } from '@graphql-tools/merge';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { resolvers } from './graphql/index.js';
import { prisma, GraphQLContext } from './prisma/client.js';

// --- Schema Merging Script (remains the same) ---
const schemaDir = path.join(process.cwd(), 'src/graphql/schemas');
const typeDefsArray = readdirSync(schemaDir)
  .filter(file => file.endsWith('.graphql'))
  .map(file => readFileSync(path.join(schemaDir, file), { encoding: 'utf-8' }));
const typeDefs = mergeTypeDefs(typeDefsArray);
// --- End of Script ---


// --- UPGRADED CONTEXT ---
// The context now includes the nullable 'currentUser'.
// It will be null if the user is not logged in, or a User object if they are.
interface ServerContext {
  prisma: GraphQLContext['prisma'];
  currentUser: User | null;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

const server = new ApolloServer<ServerContext>({
  typeDefs,
  resolvers,
});

// Asynchronous function to start the server.
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // --- UPGRADED CONTEXT FUNCTION ---
    // This function now reads the token and attaches the user to the context.
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      let currentUser: User | null = null;

      if (token) {
        try {
          // 1. Verify the token.
          const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET) as { userId: string };
          
          // 2. If valid, find the user in the database.
          if (decoded && decoded.userId) {
            currentUser = await prisma.user.findUnique({
              where: { id: decoded.userId },
            });
          }
        } catch (error) {
          // Token is invalid or expired. currentUser remains null.
          // FIX: Check if the error is an instance of Error before accessing .message
          if (error instanceof Error) {
            console.error('Authentication error:', error.message);
          } else {
            console.error('An unknown authentication error occurred', error);
          }
        }
      }

      // 3. Return the context object, now with the user's data.
      return {
        prisma,
        currentUser,
      };
    },
  });
  console.log(`🚀 Server ready at: ${url}`);
}

// Call the function to start the server.
startServer();

