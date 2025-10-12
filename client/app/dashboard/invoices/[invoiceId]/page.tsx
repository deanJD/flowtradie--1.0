// client/app/dashboard/invoices/[invoiceId]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_INVOICE_QUERY } from '@/app/lib/graphql/queries/invoice';
import { UPDATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';
import Link from 'next/link';
import styles from './InvoiceDetailsPage.module.css';
import Button from '@/components/Button/Button';

// Define the shape of a line item for our "working copy" state
interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function InvoiceDetailsPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = use(params);

  // --- 1. STATE MANAGEMENT ---
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<LineItem[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');

  // --- 2. DATA FETCHING ---
  const { data, loading, error, refetch } = useQuery(GET_INVOICE_QUERY, {
    variables: { invoiceId },
  });

  // This effect syncs the server data into our local "working copy" state
  useEffect(() => {
    if (data && data.invoice) {
      setItems(data.invoice.items.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })));
      setInvoiceNumber(data.invoice.invoiceNumber);
      setDueDate(new Date(data.invoice.dueDate).toISOString().split('T')[0]);
    }
  }, [data]);
  
  // --- 3. DATA MUTATION (SAVING) ---
  const [updateInvoice, { loading: isSaving }] = useMutation(UPDATE_INVOICE_MUTATION, {
    onCompleted: () => {
      setIsEditing(false); // Turn off edit mode on success
      refetch(); // Refetch the data to show the final saved state
    },
  });

  // --- 4. HANDLER FUNCTIONS (USER ACTIONS) ---
  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };
  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  
  const handleSave = () => {
    const itemsForMutation = items.map(({ id, ...rest }) => rest);
    updateInvoice({
      variables: {
        updateInvoiceId: invoiceId,
        input: { invoiceNumber, dueDate: new Date(dueDate), items: itemsForMutation },
      },
    });
  };

  const handleCancel = () => {
    // Reset all state to the original data from the server and exit edit mode
    if (data && data.invoice) {
        setItems(data.invoice.items);
        setInvoiceNumber(data.invoice.invoiceNumber);
        setDueDate(new Date(data.invoice.dueDate).toISOString().split('T')[0]);
    }
    setIsEditing(false);
  }

  // --- 5. DERIVED STATE (REAL-TIME CALCULATIONS) ---
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gstAmount = subtotal * (data?.invoice.gstRate || 0.1);
  const totalAmount = subtotal + gstAmount;
  const amountPaid = data?.invoice.payments.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const amountDue = totalAmount - amountPaid;

  if (loading) return <p>Loading invoice details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.invoice) return <p>Invoice not found.</p>;

  // --- 6. THE UI (JSX) ---
  return (
    <div className={styles.container}>
      <Link href={`/dashboard/projects/${data.invoice.project.id}`} className={styles.backLink}>
        ← Back to Project
      </Link>
      
      <div className={styles.header}>
        <div className={styles.headerMain}>
          {isEditing ? (
            <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className={styles.titleInput} />
          ) : (
            <h1 className={styles.title}>Invoice #{data.invoice.invoiceNumber}</h1>
          )}
        </div>
        <div className={styles.metaGrid}>
          <p className={styles.metaItem}><strong>Status:</strong> {data.invoice.status}</p>
          <p className={styles.metaItem}><strong>Project:</strong> {data.invoice.project.title}</p>
          <p className={styles.metaItem}><strong>Issue Date:</strong> {new Date(data.invoice.issueDate).toLocaleDateString()}</p>
          {isEditing ? (
             <div className={styles.metaItem}>
                <strong>Due Date: </strong>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={styles.tableInput} />
            </div>
          ) : (
            <p className={styles.metaItem}><strong>Due Date:</strong> {new Date(data.invoice.dueDate).toLocaleDateString()}</p>
          )}
        </div>
      </div>
      
      <h2 className={styles.sectionTitle}>Items</h2>
      <table className={styles.itemsTable}>
        <thead>
          <tr>
            <th>Description</th><th>Quantity</th><th>Unit Price</th><th>Total</th>
            {isEditing && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id || index}>
              <td>{isEditing ? <input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className={styles.tableInput} /> : item.description}</td>
              <td>{isEditing ? <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className={styles.tableInput} /> : item.quantity}</td>
              <td>{isEditing ? <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className={styles.tableInput} /> : `$${item.unitPrice.toFixed(2)}`}</td>
              <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
              {isEditing && <td><Button onClick={() => removeItem(index)} variant="secondary">X</Button></td>}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && (
        <div className={styles.addItemButtonContainer}>
          <Button onClick={addItem}>+ Add Item</Button>
        </div>
      )}

      <div className={styles.totals}>
          <p><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p>
          <p><span>GST ({data.invoice.gstRate * 100}%):</span> <span>${gstAmount.toFixed(2)}</span></p>
          <p className={styles.totalAmount}><span>Total:</span> <span>${totalAmount.toFixed(2)}</span></p>
          <p><span>Amount Paid:</span> <span>-${amountPaid.toFixed(2)}</span></p>
          <p className={styles.totalAmount}><strong><span>Amount Due:</span> <span>${amountDue.toFixed(2)}</span></strong></p>
      </div>
      
      <div className={styles.footerActions}>
        {isEditing ? (
          <>
            <Button onClick={handleCancel} variant="secondary">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Invoice</Button>
        )}
      </div>

      <h2 className={styles.sectionTitle}>Payments</h2>
      {data.invoice.payments.length > 0 ? (
        <table className={styles.itemsTable}>
          <thead><tr><th>Date</th><th>Amount</th><th>Method</th></tr></thead>
          <tbody>
            {data.invoice.payments.map((p: any) => (
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