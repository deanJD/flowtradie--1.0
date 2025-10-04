// client/app/lib/graphql/queries/job.ts
import { gql } from '@apollo/client';

export const GET_JOB_QUERY = gql`
  query GetJob($jobId: ID!) {
    job(id: $jobId) {
      id
      title
      description
      status
      startDate
      endDate
      customer {
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