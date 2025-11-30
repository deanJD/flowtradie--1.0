// client/app/lib/graphql/queries/dashboard.ts
import { gql } from '@apollo/client';

export const GET_DASHBOARD_SUMMARY_QUERY = gql`
  query DashboardProjects($businessId: ID!) {
    projects(businessId: $businessId) {
      id
      status
      amount   # if exists
      createdAt
    }
  }
`;
