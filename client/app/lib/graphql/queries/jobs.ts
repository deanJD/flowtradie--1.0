// client/app/lib/graphql/queries/jobs.ts
import { gql } from '@apollo/client';

// Note the plural: GET_JOBS_QUERY
export const GET_JOBS_QUERY = gql`
  query GetJobs {
    jobs {
      id
      title
      status
      customer {
        id
        name
      }
    }
  }
`;