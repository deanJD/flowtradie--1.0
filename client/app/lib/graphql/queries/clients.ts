import { gql } from '@apollo/client';

export const GET_CLIENTS_QUERY = gql`
  query GetClients {
    clients {
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
      createdAt
      updatedAt
    }
  }
`;
