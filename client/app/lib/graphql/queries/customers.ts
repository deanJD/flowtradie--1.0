// client/app/lib/graphql/queries/customers.ts
import { gql } from '@apollo/client';

export const GET_CUSTOMERS_QUERY = gql`
  query GetCustomers {
    customers {
      id
      name
    }
  }
`;