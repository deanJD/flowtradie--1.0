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
      updatedAt

      subtotal
      taxRate
      taxAmount
      totalAmount
      currencyCode
      taxLabelSnapshot

      # BUSINESS → PROJECT → CLIENT 
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

      # JSON snapshots
      businessSnapshot
      clientSnapshot
    }
  }
`;
