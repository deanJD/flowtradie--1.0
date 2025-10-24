// client/app/dashboard/invoices/[invoiceId]/preview/page.tsx
'use client';

import React, { use } from 'react'; // Import 'use' hook for server component params
import { useQuery } from '@apollo/client';
import Link from 'next/link'; // For linking back potentially

// Import the GraphQL Query
import { GET_INVOICE_QUERY } from '@/app/lib/graphql/queries/invoice'; // Adjust path if needed

// Import the styles for this page
import styles from './PreviewInvoicePage.module.css';
import Button from '@/components/Button/Button'; // Import Button for actions

// Helper function to format dates (optional, can format inline)
const formatDate = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  try {
      const date = new Date(dateString);
       // Adjust for potential timezone issues when displaying
       date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      return date.toLocaleDateString('en-AU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
      });
  } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return 'Invalid Date';
  }
};

// Helper function to format currency
const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return '$0.00';
    return `$${amount.toFixed(2)}`;
}

export default function InvoicePreviewPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  // Use the 'use' hook to resolve the promise from server component params
  const { invoiceId } = use(params);

  // Fetch the invoice data
  const { data, loading, error } = useQuery(GET_INVOICE_QUERY, {
    variables: { invoiceId },
    // Consider fetchPolicy if updates might happen elsewhere
    // fetchPolicy: 'cache-and-network',
  });

  // Handle loading and error states
  if (loading) return <div className={styles.container}><p>Loading invoice preview...</p></div>;
  if (error) return <div className={styles.container}><p>Error loading invoice: {error.message}</p></div>;
  if (!data || !data.invoice) return <div className={styles.container}><p>Invoice not found.</p></div>;

  // Destructure invoice data for easier access
  const { invoice } = data;

  // Calculate totals (prefer using backend calculated values if available)
  const amountPaid = invoice.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const amountDue = (invoice.totalAmount || 0) - amountPaid;

  return (
    
          <div className={styles.container}>
        {/* Action Bar */}
         <div className={styles.actionBar}> {/* Added a wrapper div with a class */}
             <Button href={`/dashboard/invoices/${invoiceId}/edit`} variant="secondary">Edit</Button>
            
         </div>

        <div className={styles.invoicePage}>
            {/* Header: Company Details & Invoice Title */}
            <header className={styles.header}>
                <div className={styles.companyDetails}>
                    {/* Replace with your actual company details */}
                    <h3>Your Company Name</h3>
                    <p>123 Main Street</p>
                    <p>Your City, State, 12345</p>
                    {/* Add Email/Phone */}
                </div>
                <div className={styles.invoiceTitle}>
                    <h1>Invoice</h1>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>

            {/* Bill To / From Section */}
            <section className={styles.metaGrid}>
                <div className={styles.metaSection}>
                    <h4>Bill To</h4>
                    <p><strong>{invoice.project?.client?.name || 'N/A'}</strong></p>
                    <p>{invoice.project?.client?.address || 'No address'}</p>
                    {/* Add Email/Phone if available */}
                     <p>{invoice.project?.client?.email}</p>
                     <p>{invoice.project?.client?.phone}</p>
                </div>
                <div className={styles.metaSection}>
                    <h4>From</h4>
                     {/* Replace with your actual company details */}
                    <p><strong>Your Company Name</strong></p>
                    <p>123 Main Street</p>
                    <p>Your City, State, 12345</p>
                    {/* Add Email/Phone */}
                </div>
            </section>

            {/* Invoice Details: Number, Dates, Project */}
            <section className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <label>Invoice Number</label>
                    <span>{invoice.invoiceNumber}</span>
                </div>
                <div className={styles.detailItem}>
                    <label>Date Issued</label>
                    <span>{formatDate(invoice.issueDate)}</span>
                </div>
                <div className={styles.detailItem}>
                    <label>Date Due</label>
                    <span>{formatDate(invoice.dueDate)}</span>
                </div>
                 <div className={styles.detailItem}>
                    <label>Project</label>
                    <span>{invoice.project?.title || 'N/A'}</span>
                </div>
                 <div className={styles.detailItem}>
                    <label>Status</label>
                    {/* Add status styling later if needed */}
                    <span>{invoice.status}</span>
                </div>
            </section>

            {/* Items Table */}
            <section>
                <table className={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th className={styles.colDescription}>Description</th>
                            <th className={styles.colQty}>Qty</th>
                            <th className={styles.colPrice}>Unit Price</th>
                            <th className={styles.colTotal}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item: any) => (
                            <tr key={item.id}>
                                <td>{item.description}</td>
                                <td className={styles.colQty}>{item.quantity}</td>
                                <td className={styles.colPrice}>{formatCurrency(item.unitPrice)}</td>
                                <td className={styles.colTotal}>{formatCurrency(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Totals Section */}
            <section className={styles.totalsSection}>
                <div> {/* Wrapper for alignment */}
                    <p><span>Subtotal:</span> <span>{formatCurrency(invoice.subtotal)}</span></p>
                    <p><span>GST ({ (invoice.gstRate || 0.1) * 100 }%):</span> <span>{formatCurrency(invoice.gstAmount)}</span></p>
                    {/* Only show paid/due if applicable */}
                    {amountPaid > 0 && (
                        <p><span>Amount Paid:</span> <span>-{formatCurrency(amountPaid)}</span></p>
                    )}
                    <p className={styles.totalAmount}><span>Amount Due:</span> <span>{formatCurrency(amountDue)}</span></p>
                </div>
            </section>

            {/* Notes Section (Only show if notes exist) */}
            {invoice.notes && (
                <section className={styles.notesSection}>
                    <h4>Notes / Terms</h4>
                    <p>{invoice.notes}</p>
                </section>
            )}

             {/* Payment History (Optional) */}
             {invoice.payments && invoice.payments.length > 0 && (
                <section style={{ marginTop: '2rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Payment History</h4>
                    <table className={styles.itemsTable} style={{ fontSize: '0.8rem' }}>
                        <thead>
                            <tr>
                                <th>Date Paid</th>
                                <th>Method</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.payments.map((p: any) => (
                                <tr key={p.id}>
                                    <td>{formatDate(p.date)}</td>
                                    <td>{p.method}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(p.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
             )}

        </div> {/* End .invoicePage */}
    </div> // End .container
  );
}
