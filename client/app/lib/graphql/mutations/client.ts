// client/app/lib/graphql/mutations/client.ts
import { gql } from '@apollo/client';

export const CREATE_CLIENT_MUTATION = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      
  # --- Explicitly list all fields needed by GET_CLIENTS_QUERY ---
      id
      name
      email
      phone
      addressLine1
      addressLine2
      city
      state
      postcode
      country
      createdAt # Include if your list query uses it
      updatedAt # Include if your list query uses it
      # Add other fields like 'projects' if your list query needs them
      
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
      addressLine1
      addressLine2
      city
      state
      postcode
      country
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