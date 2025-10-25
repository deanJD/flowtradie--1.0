import { gql } from "@apollo/client";

export const GET_COMPANY_SETTINGS = gql`
  query GetCompanySettings {
    companySettings {
      id
      businessName
      abn
      address
      phone
      email
      website
      logoUrl
      bankDetails
    }
  }
`;
