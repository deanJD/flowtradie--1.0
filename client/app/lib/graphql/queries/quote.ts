// client/app/lib/graphql/queries/quote.ts
import { gql } from '@apollo/client';

export const GET_QUOTE_QUERY = gql`
  query GetQuote($quoteId: ID!) {
    quote(id: $quoteId) {
      id
      quoteNumber
      status
      issueDate
      expiryDate
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
    }
  }
`;