import { gql } from "@apollo/client";

export const GET_INVOICE_SETTINGS = gql`
  query GetInvoiceSettings {
    invoiceSettings {
      id
      
      # ✅ Identity (Merged from Business)
      businessName
      abn
      phone
      email
      website
      logoUrl
      
      # ✅ Nested Address (Matches your new Schema)
      address {
        line1
        line2
        city
        state
        postcode
        country
      }

      # ✅ Configuration
      bankDetails
      invoicePrefix
      startingNumber
      defaultDueDays
      
      # ✅ Tax (Renamed from gstRate)
      taxRate
      taxLabel

      # ✅ Email Settings
      smtpHost
      smtpPort
      smtpUser
      smtpPassword
      fromEmail
      fromName
    }
  }
`;