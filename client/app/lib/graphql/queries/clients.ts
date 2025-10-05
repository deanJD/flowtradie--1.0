// client/app/lib/graphql/queries/clients.ts
import { gql } from '@apollo/client';

export const GET_CUSTOMERS_QUERY = gql`
  query GetClients {
    clients {
      id
      name
    }
  }
`;