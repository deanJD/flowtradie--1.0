// client/app/lib/graphql/queries/projects.ts
import { gql } from '@apollo/client';

export const GET_PROJECTS_QUERY = gql`
  query GetProjects($businessId: ID!) {
    projects(businessId: $businessId) {
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
