import { gql } from "@apollo/client";

export const GET_INVOICE_BY_ID = gql`
  query GetInvoiceById($id: ID!) {
    invoice(id: $id) {
      id
      invoiceNumber
      invoicePrefix
      invoiceSequence
      
      status
      issueDate
      dueDate
      notes
      updatedAt
      deletedAt

      subtotal
      taxRate
      taxAmount
      totalAmount
      currencyCode
      taxLabelSnapshot

      # Snapshots frozen at invoice creation
      businessSnapshot
      clientSnapshot

      items {
        id
        description
        quantity
        unitPrice
        total
      }

      payments {
        id
        amount
        date
        method
        notes
      }

      project {
        id
        title
        
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
  }
`;
