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

  const typesArray = loadFilesSync("src/**/*.graphql");
  const typeDefs = mergeTypeDefs(typesArray);

  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers as any, // 🛠 fixes type error
    csrfPrevention: false,       // 🧠 disable CSRF BLOCK
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),                                 // 🛡 allow frontend
    express.json({ limit: "10mb" }),        // MUST come before Apollo
    expressMiddleware(server, {
      // 🧠 fix context type:
      context: async ({ req }) => {
        return buildContext({ req }) as any;
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`🚀 FlowTradie GraphQL ready at http://localhost:4000/graphql`);
}

startServer();
export {};
