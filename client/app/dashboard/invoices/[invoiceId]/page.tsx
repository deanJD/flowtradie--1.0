// client/app/dashboard/invoices/[invoiceId]/page.tsx
'use client';

import React, { use } from 'react';
import { useQuery } from '@apollo/client';
import { GET_INVOICE_QUERY } from '@/app/lib/graphql/queries/invoice';
import Link from 'next/link';
import styles from './InvoiceDetailsPage.module.css';

export default function InvoiceDetailsPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = use(params);

  const { data, loading, error } = useQuery(GET_INVOICE_QUERY, {
    variables: { invoiceId },
  });

  if (loading) return <p>Loading invoice details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.invoice) return <p>Invoice not found.</p>;

  const { invoice } = data;

  const amountPaid = invoice.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
  const amountDue = invoice.totalAmount - amountPaid;

  return (
    <div className={styles.container}>
      <Link href={`/dashboard/jobs/${invoice.job.id}`} className={styles.backLink}>
        ← Back to Job
      </Link>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Invoice #{invoice.invoiceNumber}</h1>
        <div className={styles.metaGrid}>
          <p className={styles.metaItem}><strong>Status:</strong> {invoice.status}</p>
          <p className={styles.metaItem}><strong>Job:</strong> {invoice.job.title}</p>
          <p className={styles.metaItem}><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
          <p className={styles.metaItem}><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <h2 className={styles.sectionTitle}>Items</h2>
      <table className={styles.itemsTable}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item: any) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)}</td>
              <td>${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.totals}>
        <p><span>Subtotal:</span> <span>${invoice.subtotal.toFixed(2)}</span></p>
        <p><span>GST ({invoice.gstRate * 100}%):</span> <span>${invoice.gstAmount.toFixed(2)}</span></p>
        <p className={styles.totalAmount}><span>Total:</span> <span>${invoice.totalAmount.toFixed(2)}</span></p>
        <p><span>Amount Paid:</span> <span>-${amountPaid.toFixed(2)}</span></p>
        <p className={styles.totalAmount}><strong><span>Amount Due:</span> <span>${amountDue.toFixed(2)}</span></strong></p>
      </div>

      <h2 className={styles.sectionTitle}>Payments</h2>
      {invoice.payments.length > 0 ? (
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {invoice.payments.map((p: any) => (
              <tr key={p.id}>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>${p.amount.toFixed(2)}</td>
                <td>{p.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No payments have been recorded for this invoice yet.</p>}
    </div>
  );
}