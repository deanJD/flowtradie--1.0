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
      # This is the new part we are adding
      tasks {
        id
        title
        isCompleted
      }
    }
  }
`;