// client/app/lib/graphql/mutations/invoice.ts
import { gql } from '@apollo/client';

export const CREATE_INVOICE_MUTATION = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      invoiceNumber
      status
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


