// client/app/lib/graphql/mutations/client.ts
import { gql } from '@apollo/client';

export const CREATE_CLIENT_MUTATION = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      firstName
      lastName
      businessName
      email
      phone
      type
      notes
      createdAt
      updatedAt
      addresses {
        id
        line1
        city
        postcode
        country
      }
    }
  }
`;

export const UPDATE_CLIENT_MUTATION = gql`
  mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
    updateClient(id: $id, input: $input) {
      id
      firstName
      lastName
      businessName
      email
      phone
      type
      notes
      updatedAt
    }
  }
`;


export const DELETE_CLIENT_MUTATION = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
    }
  }
`;
