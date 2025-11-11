import { gql } from "@apollo/client";

export const GET_INVOICE_SETTINGS = gql`
  query GetInvoiceSettings {
    invoiceSettings {
      id
      businessName
      abn
      addressLine1
      addressLine2
      city
      state
      postcode
      country

      phone
      email
      website
      logoUrl
      bankDetails

      invoicePrefix
      startingNumber
      defaultDueDays
      gstRate

      smtpHost
      smtpPort
      smtpUser
      smtpPassword
      fromEmail
      fromName
    }
  }
`;
