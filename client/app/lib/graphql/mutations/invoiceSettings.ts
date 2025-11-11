import { gql } from "@apollo/client";

export const UPDATE_INVOICE_SETTINGS = gql`
  mutation UpdateInvoiceSettings($input: InvoiceSettingsInput!) {
    updateInvoiceSettings(input: $input) {
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
