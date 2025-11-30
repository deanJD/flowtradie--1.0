import { gql } from "@apollo/client";

export const GET_CLIENTS_QUERY = gql`
  query GetClients($businessId: ID!) {
    clients(businessId: $businessId) {
      id
      firstName
      lastName
      businessName
      email
      phone
      type
      createdAt
    }
  }
`;
