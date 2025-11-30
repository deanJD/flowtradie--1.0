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
        resolvers: resolvers,
        csrfPrevention: false,
    });
    await server.start();
    app.use("/graphql", cors(), express.json({ limit: "10mb" }), expressMiddleware(server, {
        // 🔥 FIX — buildContext is async → MUST await
        context: async ({ req }) => {
            return await buildContext({ req });
        },
    }));
    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 FlowTradie GraphQL ready at http://localhost:4000/graphql`);
}
startServer();
//# sourceMappingURL=index.js.map