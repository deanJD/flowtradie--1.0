// client/app/lib/graphql/mutations/invoice.ts
import { gql } from "@apollo/client";

/* ======================================
   CREATE INVOICE
====================================== */
export const CREATE_INVOICE_MUTATION = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      invoiceNumber
      invoicePrefix
      invoiceSequence

      status
      issueDate
      dueDate
      updatedAt

      subtotal
      taxRate
      taxAmount
      totalAmount
      currencyCode
      taxLabelSnapshot

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

      businessSnapshot
      clientSnapshot
    }
  }
`;

/* ======================================
   UPDATE INVOICE
====================================== */
export const UPDATE_INVOICE_MUTATION = gql`
  mutation UpdateInvoice($id: ID!, $input: UpdateInvoiceInput!) {
    updateInvoice(id: $id, input: $input) {
      id
      invoiceNumber
      status
      issueDate
      dueDate
      notes
      updatedAt

      subtotal
      taxRate
      taxAmount
      totalAmount
      currencyCode
      taxLabelSnapshot

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

      businessSnapshot
      clientSnapshot
    }
  }
`;

/* ======================================
   DELETE INVOICE (SOFT DELETE)
====================================== */
export const DELETE_INVOICE_MUTATION = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id) {
      id
      deletedAt
    }
  }
`;
