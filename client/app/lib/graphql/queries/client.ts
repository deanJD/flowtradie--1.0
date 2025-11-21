import { gql } from '@apollo/client';

export const GET_CLIENT_QUERY = gql`
  query GetClient($id: ID!) {
    client(id: $id) {
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
