import { gql } from '@apollo/client';

export const GET_CLIENT_QUERY = gql`
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

      addresses {      # 👈 MUST NEST ADDRESS FIELDS
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

      projects {        # OPTIONAL — REMOVE IF NOT NEEDED
        id
        title
        status
      }

      invoices {        # OPTIONAL — REMOVE IF NOT NEEDED
        id
        status
        totalAmount
        dueDate
      }
    }
  }
`;
