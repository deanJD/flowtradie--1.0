// client/app/lib/graphql/queries/invoice.ts
import { gql } from '@apollo/client';

export const GET_INVOICE_QUERY = gql`
  query GetInvoice($invoiceId: ID!) {
    invoice(id: $invoiceId) {
      id
      invoiceNumber
      status
      issueDate
      dueDate
      subtotal
      gstRate
      gstAmount
      totalAmount
      project {
        id
        title
      }
      items {
        id
        description
        quantity
        unitPrice
        total
      }
      payments {
        id
        amount
        date
        method
      }
    }
  }
`;