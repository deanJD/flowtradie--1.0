// client/app/lib/graphql/queries/project.ts
import { gql } from '@apollo/client';

export const GET_PROJECT_QUERY = gql`
  query GetProject($projectId: ID!) {
    project(id: $projectId) {
      id
      title
      description
      status
      startDate
      endDate
      client {
        id
        name
      }
      tasks {
        id
        title
        isCompleted
      }
      # vvvv NEW FIELDS ADDED BELOW vvvv
      quotes {
        id
        quoteNumber
        status
        totalAmount
      }
      invoices {
        id
        invoiceNumber
        status
        totalAmount
      }
      # ^^^^ NEW FIELDS ADDED ABOVE ^^^^
    }
  }
`;