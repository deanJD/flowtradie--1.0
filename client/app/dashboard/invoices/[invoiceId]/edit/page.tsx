'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import styles from './EditInvoicePage.module.css';

const GET_INVOICE = gql`
  query GetInvoiceForEdit($invoiceId: ID!) {
    invoice(id: $invoiceId) {
      id
      invoiceNumber
      status
      issueDate
      dueDate
      notes
      subtotal
      gstRate
      gstAmount
      totalAmount
      items { id description quantity unitPrice total }
    }
  }
`;

const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($id: ID!, $input: UpdateInvoiceInput!) {
    updateInvoice(id: $id, input: $input) {
      id
      invoiceNumber
      status
      notes
      subtotal
      gstAmount
      totalAmount
    }
  }
`;

export default function EditInvoicePage() {
  const router = useRouter();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { data, loading, error } = useQuery(GET_INVOICE, { variables: { invoiceId } });
  const [updateInvoice] = useMutation(UPDATE_INVOICE);

  const inv = data?.invoice;

  const [status, setStatus] = useState('DRAFT');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<
    { id?: string; description: string; quantity: number; unitPrice: number; total: number }[]
  >([]);

  // Load data into form when ready
  useEffect(() => {
    if (inv) {
      setStatus(inv.status || 'DRAFT');
      setNotes(inv.notes || '');
      setItems(inv.items || []);
    }
  }, [inv]);

  // Auto-calc totals
  const subtotal = items.reduce((acc, it) => acc + it.total, 0);
  const gstRate = inv?.gstRate ?? 0.1;
  const gstAmount = subtotal * gstRate;
  const totalAmount = subtotal + gstAmount;

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === index
          ? {
              ...it,
              [field]: field === 'description' ? value : Number(value),
              total:
                field === 'quantity'
                  ? Number(value) * it.unitPrice
                  : field === 'unitPrice'
                  ? it.quantity * Number(value)
                  : it.total,
            }
          : it
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateInvoice({
        variables: {
          id: invoiceId,
          input: {
            status,
            notes,
            subtotal,
            gstAmount,
            totalAmount,
            items: items.map(({ id, description, quantity, unitPrice, total }) => ({
              id,
              description,
              quantity,
              unitPrice,
              total,
            })),
          },
        },
      });
      router.push(`/dashboard/invoices/${invoiceId}/preview`);
    } catch (err: any) {
      alert(`❌ Failed to update invoice: ${err.message}`);
    }
  };

  if (loading) return <div className={styles.loading}>Loading invoice…</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;
  if (!inv) return <div className={styles.error}>Invoice not found.</div>;

  return (
    <div className={styles.wrapper}>
      <h1>Edit Invoice #{inv.invoiceNumber}</h1>

      <div className={styles.fieldGroup}>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
        </select>
      </div>

      <h2>Invoice Items</h2>
      <table className={styles.itemsTable}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={it.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={it.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={it.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                />
              </td>
              <td>${it.total.toFixed(2)}</td>
              <td>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(index)}
                  title="Remove item"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem} className={styles.addItemBtn}>+ Add Item</button>

      <div className={styles.totals}>
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div>GST ({(gstRate * 100).toFixed(0)}%): ${gstAmount.toFixed(2)}</div>
        <div className={styles.totalAmount}>Total: ${totalAmount.toFixed(2)}</div>
      </div>

      <div className={styles.fieldGroup}>
        <label>Notes</label>
        <textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className={styles.actions}>
        <button onClick={() => router.back()} className={styles.btnSecondary}>Cancel</button>
        <button onClick={handleSave} className={styles.btnPrimary}>Save Invoice</button>
      </div>
    </div>
  );
}
