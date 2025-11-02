import { gql } from "@apollo/client";

export const GET_INVOICE_SETTINGS = gql`
  query GetInvoiceSettings {
    invoiceSettings {
      id
      businessName
      abn
      address
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

export const SAVE_INVOICE_SETTINGS = gql`
  mutation SaveInvoiceSettings($input: InvoiceSettingsInput!) {
    saveInvoiceSettings(input: $input) {
      id
      businessName
      abn
      address
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
