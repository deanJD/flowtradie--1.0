// client/app/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: "http://localhost:4000/",
});

// This 'authLink' is a middleware that will add the token to the headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  // Use 'from' to chain the authLink and httpLink together
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;