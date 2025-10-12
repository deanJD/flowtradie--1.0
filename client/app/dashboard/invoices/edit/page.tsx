// client/app/dashboard/invoices/[invoiceId]/edit/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_INVOICE_QUERY } from '@/app/lib/graphql/queries/invoice';
import { UPDATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';
import styles from './EditInvoicePage.module.css';
import Button from '@/components/Button/Button';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function EditInvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = use(params);
  const router = useRouter();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<LineItem[]>([]);

  const { data: invoiceData, loading: invoiceLoading } = useQuery(GET_INVOICE_QUERY, {
    variables: { invoiceId },
  });

  useEffect(() => {
    if (invoiceData && invoiceData.invoice) {
      const { invoice } = invoiceData;
      setInvoiceNumber(invoice.invoiceNumber);
      setDueDate(new Date(invoice.dueDate).toISOString().split('T')[0]);
      setItems(invoice.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })));
    }
  }, [invoiceData]);

  const [updateInvoice, { loading: isSaving, error: updateError }] = useMutation(UPDATE_INVOICE_MUTATION, {
    onCompleted: () => {
      router.push(`/dashboard/invoices/${invoiceId}`);
    },
    refetchQueries: [{ query: GET_INVOICE_QUERY, variables: { invoiceId } }, 'GetInvoices'],
  });

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };
  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateInvoice({
      variables: {
        updateInvoiceId: invoiceId,
        input: {
          invoiceNumber,
          dueDate: new Date(dueDate),
          items: items,
        },
      },
    });
  };

  if (invoiceLoading) return <p>Loading invoice for editing...</p>;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Edit Invoice</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="invoiceNumber" className={styles.label}>Invoice Number</label>
          <input id="invoiceNumber" type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required className={styles.input} />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="dueDate" className={styles.label}>Due Date</label>
          <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className={styles.input} />
        </div>

        {/* FIX: Removed the inline style */}
        <h2 className={styles.sectionTitle}>Items</h2>
        <table className={styles.itemsTable}>
          <thead>
            <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {/* FIX: Use the strong LineItem type */}
            {items.map((item: LineItem, index) => (
              <tr key={index}> {/* Note: key={index} is okay for now, but not ideal for complex lists */}
                <td><input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className={styles.tableInput} /></td>
                <td><input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className={styles.tableInput} /></td>
                <td><input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className={styles.tableInput} /></td>
                <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                <td><Button onClick={() => removeItem(index)} variant="secondary">X</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className={styles.addItemButtonContainer}>
          <Button onClick={addItem}>+ Add Item</Button>
        </div>

        {updateError && <p style={{ color: 'red' }}>Error: {updateError.message}</p>}

        <div className={styles.buttonGroup}>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button href={`/dashboard/invoices/${invoiceId}`} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}