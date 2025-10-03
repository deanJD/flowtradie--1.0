// client/app/lib/ApolloWrapper.tsx
"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
// THE FIX: Remove the curly braces to correctly import the default export
import client from "./apollo-client";

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}