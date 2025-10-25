import { gql } from "@apollo/client";

export const UPDATE_COMPANY_SETTINGS = gql`
  mutation UpdateCompanySettings($input: CompanySettingsInput!) {
    updateCompanySettings(input: $input) {
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
