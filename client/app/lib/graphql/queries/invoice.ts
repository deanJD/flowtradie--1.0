// client/app/lib/graphql/queries/invoice.ts
import { gql } from '@apollo/client';

/**
 * Canonical single-invoice query
 * Used for: Edit page, Preview page, PDF
 */
export const GET_INVOICE_QUERY = gql`
  query GetInvoice($invoiceId: ID!) {
    invoice(id: $invoiceId) {
      id
      invoiceNumber
      status
      issueDate
      dueDate
      notes

      # --- Totals ---
      subtotal
      gstRate
      gstAmount
      totalAmount

      # --- Project & Client ---
      project {
        id
        title
        client {
          id
          name
          address
          phone
          email
        }
      }

      # --- Items ---
      items {
        id
        description
        quantity
        unitPrice
        total
      }

      # --- Payments ---
      payments {
        id
        amount
        date
        method
      }

      # --- Snapshot (CRITICAL for Edit & Preview) ---
      businessName
      abn
      address
      phone
      email
      website
      logoUrl
      bankDetails
    }
  }
`;
