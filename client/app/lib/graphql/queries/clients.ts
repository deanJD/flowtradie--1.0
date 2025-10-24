// client/app/lib/graphql/queries/clients.ts
import { gql } from '@apollo/client';

export const GET_CLIENTS_QUERY = gql`
  query GetClients {
    clients {
      id
      name
      email
      phone
      address
    }
  }
`;