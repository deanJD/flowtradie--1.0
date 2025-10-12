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
// At the bottom of client/app/lib/graphql/mutations/client.ts

export const UPDATE_CLIENT_MUTATION = gql`
  mutation UpdateClient($updateClientId: ID!, $input: UpdateClientInput!) {
    updateClient(id: $updateClientId, input: $input) {
      id
      name
      email
      phone
      address
    }
  }
`;
// At the bottom of client/app/lib/graphql/mutations/client.ts

export const DELETE_CLIENT_MUTATION = gql`
  mutation DeleteClient($deleteClientId: ID!) {
    deleteClient(id: $deleteClientId) {
      id
    }
  }
`;