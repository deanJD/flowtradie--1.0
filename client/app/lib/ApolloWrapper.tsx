// client/app/lib/ApolloWrapper.tsx
"use client";

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React, { useEffect, useState } from "react";

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");  // <-- read every mount

    const httpLink = createHttpLink({
      uri: "http://localhost:4000/graphql",
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }));

    setClient(
      new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      })
    );
  }, []); // ← only mount ONCE = consistent with redirect & reload

  if (!client) return null; // or spinner

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
