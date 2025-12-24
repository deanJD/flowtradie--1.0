// client/app/lib/graphql/queries/projects.ts
import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      status
      startDate
      endDate
      budgetedAmount

      client {
        id
        firstName
        lastName
        businessName
      }

      siteAddress {
        id
        line1
        line2
        city
        state
        postcode
        country
        countryCode
      }

      financialSummary {
        invoicesTotal
        paymentsTotal
        expensesTotal
        hoursWorked
        estimatedProfit
      }

      isOverdue
      progress
      totalHoursWorked
    }
  }
`;
