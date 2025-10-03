// client/app/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({
  // The URL of your running GraphQL server
  uri: "http://localhost:4000/",
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export default client;