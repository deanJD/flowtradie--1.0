// client/app/lib/graphql/queries/invoice.ts
import { gql } from '@apollo/client';

// THE FIX: Renamed from GET_INVOICES_QUERY to GET_INVOICE_QUERY (singular)
export const GET_INVOICE_QUERY = gql`
  query GetInvoice($invoiceId: ID!) {
    invoice(id: $invoiceId) {
      id
      invoiceNumber
      status
      issueDate
      dueDate
      notes # Include notes field
      subtotal
      gstRate
      gstAmount
      totalAmount
      project {
        id
        title
        client { # <-- Re-added client details
          id
          name
          address
          email
          phone
        }
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
