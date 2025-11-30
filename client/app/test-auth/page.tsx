"use client";

import { useQuery, gql } from "@apollo/client";

const TEST_QUERY = gql`
  query {
    invoiceSettings {
      businessName
      email
    }
  }
`;

export default function TestAuth() {
  const { data, loading, error } = useQuery(TEST_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <pre>Error: {error.message}</pre>;

  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
