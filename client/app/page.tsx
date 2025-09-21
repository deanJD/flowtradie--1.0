'use client';

import { useQuery } from '@apollo/client';
import { PING_QUERY } from '../lib/graphql/queries/ping';
import { client } from '../lib/graphql/client';
import { ApolloProvider } from '@apollo/client';

function PingComponent() {
  const { data, loading, error } = useQuery(PING_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <p>Server says: {data.ping}</p>;
}

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <main>
        <h1>Construction Trade Management App</h1>
        <PingComponent />
      </main>
    </ApolloProvider>
  );
}