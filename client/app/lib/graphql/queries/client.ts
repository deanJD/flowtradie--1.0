import { gql } from '@apollo/client';

export const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    client(id: $id) {
      id
      businessId
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
        addressType
        line1
        line2
        city
        state
        postcode
        country
        countryCode
      }

      projects {
        id
        title
        status
      }

      invoices {
        id
        status
        totalAmount
        dueDate
      }
    }
  }
`;