// client/app/lib/graphql/queries/projects.ts
import { gql } from '@apollo/client';

// Note the plural: GET_JOBS_QUERY
export const GET_JOBS_QUERY = gql`
  query GetProjects {
    projects {
      id
      title
      status
      client {
        id
        name
      }
    }
  }
`;