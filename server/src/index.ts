// This is the main entry point for the entire application.
// It brings together the schema, resolvers, and database client to start the server.

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { mergeTypeDefs } from '@graphql-tools/merge';
// FIX: The import path for resolvers was corrected to point to the graphql index.
import { resolvers } from './graphql/index.js';
// FIX: The import path for the prisma client was corrected to be relative.
import { prisma, GraphQLContext } from './prisma/client.js';

// --- Automatic Schema Merging Script ---
// This script reads all .graphql files from your schemas directory and merges them.
const schemaDir = path.join(process.cwd(), 'src/graphql/schemas');
const typeDefsArray = readdirSync(schemaDir)
  .filter(file => file.endsWith('.graphql'))
  .map(file => readFileSync(path.join(schemaDir, file), { encoding: 'utf-8' }));
const typeDefs = mergeTypeDefs(typeDefsArray);
// --- End of Script ---


// Define the context interface for our server.
interface ServerContext {
  prisma: GraphQLContext['prisma'];
}

// Create a new instance of the Apollo Server.
const server = new ApolloServer<ServerContext>({
  typeDefs,  // The merged GraphQL schema
  resolvers, // The merged resolvers
});


// Asynchronous function to start the server.
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // The `context` function is called for every incoming request,
    // providing the Prisma client instance to every resolver.
    context: async () => ({
      prisma,
    }),
  });
  console.log(`🚀 Server ready at: ${url}`);
}

// Call the function to start the server.
startServer();

