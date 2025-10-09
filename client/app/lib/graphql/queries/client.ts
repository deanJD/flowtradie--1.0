// client/app/lib/graphql/queries/client.ts
import { gql } from '@apollo/client';

export const GET_CLIENT_QUERY = gql`
  query GetClient($clientId: ID!) {
    client(id: $clientId) {
      id
      name
      email
      phone
      address
      projects {
        id
        title
        status
      }
    }
  }
`;