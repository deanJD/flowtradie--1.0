import { gql } from "@apollo/client";

export const UPDATE_INVOICE_SETTINGS = gql`
  mutation UpdateInvoiceSettings($input: InvoiceSettingsInput!) {
    updateInvoiceSettings(input: $input) {
      id

      # identity
      businessName
      legalName        
      businessNumber   
      businessType     

      phone
      email
      website
      logoUrl

      # address
      address {
        line1
        line2
        city
        state
        postcode
        country
        countryCode
      }

      # config
      bankDetails
      invoicePrefix
      startingNumber
      defaultDueDays

      # sending
      smtpHost
      smtpPort
      smtpUser
      smtpPassword
      fromEmail
      fromName
    }
  }
`;
