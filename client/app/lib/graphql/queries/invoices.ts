import { gql } from "@apollo/client";

export const GET_INVOICES = gql`
  query Invoices($businessId: ID!) {
    invoices(businessId: $businessId) {
      id
      invoiceNumber
      status
      totalAmount
      dueDate
      client {
        firstName
        lastName
      }
    }
  }
`;
