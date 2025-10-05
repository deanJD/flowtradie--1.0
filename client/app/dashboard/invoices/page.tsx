// client/app/dashboard/invoices/page.tsx
'use client';

import React from 'react';
import styles from './InvoicesPage.module.css';

// Placeholder data to build our UI
const mockData = [
  { id: '1', invoiceNumber: 'INV-2025-001', customer: { name: 'Skyline Constructions' }, status: 'PAID', totalAmount: 1250.00 },
  { id: '2', invoiceNumber: 'INV-2025-002', customer: { name: 'John Smith Contracting' }, status: 'SENT', totalAmount: 3400.50 },
  { id: '3', invoiceNumber: 'INV-2025-003', customer: { name: 'Beta Builders' }, status: 'DRAFT', totalAmount: 800.00 },
];

// A helper function to get the right style for each status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'PAID': return styles.statusPaid;
    case 'SENT': return styles.statusSent;
    case 'DRAFT': return styles.statusDraft;
    default: return styles.statusDraft;
  }
};

export default function InvoicesPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Invoices</h1>
        <div className={styles.actions}>
          <input type="search" placeholder="Search invoices..." className={styles.searchBar} />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.customer.name}</td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>${invoice.totalAmount.toFixed(2)}</td>
                <td>...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}