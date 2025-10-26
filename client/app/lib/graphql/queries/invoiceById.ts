import { gql } from "@apollo/client";

export const GET_INVOICE_BY_ID = gql`
  query GetInvoiceById($id: ID!) {
    invoice(id: $id) {
      id
      invoiceNumber
      status
      issueDate
      dueDate
      subtotal
      gstRate
      gstAmount
      totalAmount
      notes

      # Snapshot (from CompanySettings at time of creation)
      businessName
      abn
      address
      phone
      email
      website
      logoUrl
      bankDetails

      items {
        id
        description
        quantity
        unitPrice
        total
      }

      project {
        id
        title
        client {
          id
          name
        }
      }
    }
  }
`;
