// server/src/index.ts
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import express from "express";
import http from "http";
import cors from "cors";

import { resolvers } from "./graphql/index.js";
import { buildContext } from "./context.js";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const typesArray = loadFilesSync("src/graphql/schemas/**/*.graphql");
  const typeDefs = mergeTypeDefs(typesArray);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json(), // This line is essential and must be here
    
    expressMiddleware(server, {
      context: async ({ req }: { req: any }) => buildContext({ req }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:4000/`);
}

startServer();