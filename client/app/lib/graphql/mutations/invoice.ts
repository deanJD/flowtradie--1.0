// client/app/lib/graphql/mutations/invoice.ts
import { gql } from '@apollo/client';

// client/app/lib/graphql/mutations/invoice.ts
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


// vvvv ADD THIS NEW MUTATION TO THE FILE vvvv
export const UPDATE_INVOICE_MUTATION = gql`
  mutation UpdateInvoice($updateInvoiceId: ID!, $input: UpdateInvoiceInput!) {
    updateInvoice(id: $updateInvoiceId, input: $input) {
      id # We just need to know it was successful
    }
  }
`;

// vvvv THIS IS THE NEW MUTATION YOU ARE ADDING vvvv
export const DELETE_INVOICE_MUTATION = gql`
  mutation DeleteInvoice($deleteInvoiceId: ID!) {
    deleteInvoice(id: $deleteInvoiceId) {
      id # We just need the ID back to confirm the deletion for our cache update
    }
  }
`;


