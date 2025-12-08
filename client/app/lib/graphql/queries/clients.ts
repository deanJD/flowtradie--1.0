import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query Clients {
    clients {
      id
      firstName
      lastName
      businessName
      email
      phone
      type
      notes
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
    }
  }
`;
