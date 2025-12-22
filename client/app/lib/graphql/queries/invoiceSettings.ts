import { gql } from "@apollo/client";

export const GET_INVOICE_SETTINGS = gql`
  query GetInvoiceSettings {
    invoiceSettings {
      id

      # Identity text fields (mapped through service)
      businessName
      legalName
      businessNumber
      businessType

      email
      phone
      website
      logoUrl

      # Address snapshot
      address {
        line1
        line2
        city
        state
        postcode
        country
        countryCode
      }

      # Config
      bankDetails
      invoicePrefix
      startingNumber
      defaultDueDays

      # Emailing
      smtpHost
      smtpPort
      smtpUser
      smtpPassword
      fromEmail
      fromName
    }
  }
`;
