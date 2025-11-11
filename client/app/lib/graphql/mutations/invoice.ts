// client/app/lib/graphql/mutations/invoice.ts
import { gql } from '@apollo/client';

export const CREATE_INVOICE_MUTATION = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      invoiceNumber
      issueDate
      dueDate
      status
      subtotal
      gstAmount
      totalAmount
      project {
        client {
          name
        }
      }
    }
  }
`;

/**
 * ✅ FIXED: Update now returns the FULL updated invoice,
 * so the Edit Page and Preview Page always stay in sync.
 */
export const UPDATE_INVOICE_MUTATION = gql`
  mutation UpdateInvoice($updateInvoiceId: ID!, $input: UpdateInvoiceInput!) {
    updateInvoice(id: $updateInvoiceId, input: $input) {
      id
      invoiceNumber
      status
      issueDate
      dueDate
      notes
      subtotal
      gstRate
      gstAmount
      totalAmount

      project {
        id
        title
        client {
          id
          name
          addressLine1
          addressLine2
          city
          state
          postcode
          country
          phone
          email
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

      # Snapshot fields
      businessName
      abn
      addressLine1
      addressLine2
      city
      state
      postcode
      country
      phone
      email
      website
      logoUrl
      bankDetails
    }
  }
`;

export const DELETE_INVOICE_MUTATION = gql`
  mutation DeleteInvoice($deleteInvoiceId: ID!) {
    deleteInvoice(id: $deleteInvoiceId) {
      id
    }
  }
`;
