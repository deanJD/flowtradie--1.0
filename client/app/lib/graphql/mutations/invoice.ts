// client/app/lib/graphql/mutations/invoice.ts
import { gql } from '@apollo/client';

//
// =========================
//    CREATE INVOICE
// =========================
//
export const CREATE_INVOICE_MUTATION = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      invoiceNumber
      issueDate
      dueDate
      status
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
        }
      }

      # Snapshot fields coming from settings
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

//
// =========================
//    UPDATE INVOICE
// =========================
//
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

//
// =========================
//    DELETE INVOICE
// =========================
//
export const DELETE_INVOICE_MUTATION = gql`
  mutation DeleteInvoice($deleteInvoiceId: ID!) {
    deleteInvoice(id: $deleteInvoiceId) {
      id
    }
  }
`;
