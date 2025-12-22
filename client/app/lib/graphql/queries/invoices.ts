import { gql } from "@apollo/client";

export const GET_INVOICES_DASHBOARD = gql`
  query GetInvoices {
    invoices {
      id
      invoiceNumber
      status
      issueDate
      dueDate

      subtotal
      taxAmount
      totalAmount
      currencyCode

      project {
        id
        title
      }

      payments {
        id
        amount
      }
    }
  }
`;
