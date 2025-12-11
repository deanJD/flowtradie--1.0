import { gql } from "@apollo/client";

export const GET_INVOICES = gql`
  query Invoices {
    invoices {
      id
      invoiceNumber
      status
      totalAmount
      dueDate

      project {
        id
        title
        client {
          id
          firstName
          lastName
          businessName
        }
      }
    }
  }
`;