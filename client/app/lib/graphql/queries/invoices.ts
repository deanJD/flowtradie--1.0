// client/app/lib/graphql/queries/invoices.ts
import { gql } from '@apollo/client';

export const GET_INVOICES_QUERY = gql`
  query GetInvoices {
    invoices {
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