// client/app/lib/graphql/queries/project.ts
import { gql } from "@apollo/client";

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      title
      description
      status
      startDate
      endDate
      budgetedAmount
      createdAt
      updatedAt

      client {
        id
        firstName
        lastName
        businessName
        email
        phone
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

      tasks {
        id
        title
        status
        dueDate
      }

      quotes {
        id
        status
        totalAmount
      }

      invoices {
        id
        status
        totalAmount
      }

      expenses {
        id
        amount
        category
        date
      }

      timeLogs {
        id
        date
        hoursWorked
        notes
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

export const GET_PROJECT_REPORT = gql`
  query ProjectReport($id: ID!) {
    projectReport(id: $id) {
      invoicesTotal
      paymentsTotal
      expensesTotal
      hoursWorked
      estimatedProfit
    }
  }
`;
