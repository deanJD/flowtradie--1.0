import { gql } from "@apollo/client";

export const GET_INVOICE = gql`
  query GetInvoice($id: ID!) {
    invoice(id: $id) {
      id
      invoiceNumber
      invoicePrefix
      invoiceSequence
      status
      issueDate
      dueDate
      notes

      subtotal
      taxRate
      taxAmount
      totalAmount
      currencyCode
      taxLabelSnapshot

      project {
        id
        title

        siteAddress {
          id
          line1
          line2
          city
          state
          postcode
          country
          countryCode
        }

        client {
          id
          firstName
          lastName
          businessName
        }
      }

      client {
        id
        firstName
        lastName
        businessName
        email
        phone
      }
    }
  }
`;
