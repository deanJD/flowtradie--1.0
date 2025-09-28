// src/index.ts
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { resolvers } from "./graphql/index.js";
import { buildContext } from "./context.js";
// ✅ Load ALL schema files
const typesArray = loadFilesSync("src/graphql/schemas/**/*.graphql");
const typeDefs = mergeTypeDefs(typesArray);
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async ({ req }) => buildContext({ req }),
    });
    console.log(`🚀 Server ready at ${url}`);
}
startServer();
//# sourceMappingURL=index.js.map