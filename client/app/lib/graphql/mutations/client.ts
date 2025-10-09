// client/app/lib/graphql/mutations/client.ts
import { gql } from '@apollo/client';

export const CREATE_CLIENT_MUTATION = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      name
    }
  }
`;