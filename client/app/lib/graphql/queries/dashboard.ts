import { gql } from '@apollo/client';

export const GET_DASHBOARD_SUMMARY_QUERY = gql`
  # 🔴 REMOVE ARGUMENTS: query GetDashboardSummary($businessId: ID!)
  # 🟢 USE THIS:
  query GetDashboardSummary {
    getDashboardSummary {
      # 🔥 These names MUST match your Service return object exactly
      totalOpenProjects
      invoicesDueSoon
      tasksDueToday
      totalRevenueYTD
    }
  }
`;