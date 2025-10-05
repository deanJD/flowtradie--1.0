// client/app/dashboard/quotes/[quoteId]/page.tsx
'use client';

import React, { use } from 'react';
import { useQuery } from '@apollo/client';
import { GET_QUOTE_QUERY } from '@/app/lib/graphql/queries/quote';
import Link from 'next/link';
import styles from './QuoteDetailsPage.module.css';

export default function QuoteDetailsPage({ params }: { params: Promise<{ quoteId: string }> }) {
  const { quoteId } = use(params);

  const { data, loading, error } = useQuery(GET_QUOTE_QUERY, {
    variables: { quoteId },
  });

  if (loading) return <p>Loading quote details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.quote) return <p>Quote not found.</p>;

  const { quote } = data;

  return (
    <div className={styles.container}>
      <Link href={`/dashboard/projects/${quote.project.id}`} className={styles.backLink}>
        ← Back to Project
      </Link>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Quote #{quote.quoteNumber}</h1>
        <div className={styles.metaGrid}>
          <p className={styles.metaItem}><strong>Status:</strong> {quote.status}</p>
          <p className={styles.metaItem}><strong>Project:</strong> {quote.project.title}</p>
          <p className={styles.metaItem}><strong>Issue Date:</strong> {new Date(quote.issueDate).toLocaleDateString()}</p>
          {quote.expiryDate && <p className={styles.metaItem}><strong>Expiry Date:</strong> {new Date(quote.expiryDate).toLocaleDateString()}</p>}
        </div>
      </div>
      
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
          {quote.items.map((item: any) => (
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
        <p>
          <span>Subtotal:</span>
          <span>${quote.subtotal.toFixed(2)}</span>
        </p>
        <p>
          <span>GST ({quote.gstRate * 100}%):</span>
          <span>${quote.gstAmount.toFixed(2)}</span>
        </p>
        <p className={styles.totalAmount}>
          <span>Total:</span>
          <span>${quote.totalAmount.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}