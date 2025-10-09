// client/app/lib/graphql/queries/dashboard.ts
import { gql } from '@apollo/client';

export const GET_DASHBOARD_SUMMARY_QUERY = gql`
  query GetDashboardSummary {
    getDashboardSummary {
      totalOpenProjects
      invoicesDueSoon
      tasksDueToday
      totalRevenueYTD
    }
  }
`;