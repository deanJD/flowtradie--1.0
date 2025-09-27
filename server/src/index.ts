import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/schemas/root.graphql";
import { resolvers } from "./graphql/resolvers";
import { buildContext } from "./context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  context: async ({ req }) => buildContext(req),
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
