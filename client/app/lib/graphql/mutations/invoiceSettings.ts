import { gql } from "@apollo/client";

export const UPDATE_INVOICE_SETTINGS_NUMBER = gql`
  mutation UpdateInvoiceSettingsNumber($id: ID!, $input: InvoiceSettingsInput!) {
    saveInvoiceSettings(input: $input) {
      id
      startingNumber
    }
  }
`;
