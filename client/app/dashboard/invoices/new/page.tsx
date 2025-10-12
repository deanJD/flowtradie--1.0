// client/app/dashboard/invoices/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects';
import { GET_INVOICES_QUERY } from '@/app/lib/graphql/queries/invoices'; // <-- 1. Import the list query
import { CREATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';
import styles from './NewInvoicePage.module.css';
import Button from '@/components/Button/Button';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  const router = useRouter();

  const [projectId, setProjectId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS_QUERY);

  // vvvvvvvvvvvvvv THIS IS THE FIX vvvvvvvvvvvvvv
  const [createInvoice, { loading: isCreating }] = useMutation(CREATE_INVOICE_MUTATION, {
    update(cache, { data: { createInvoice: newInvoice } }) {
      // Read the existing invoices from the cache
      const data = cache.readQuery<{ invoices: any[] }>({ query: GET_INVOICES_QUERY });

      if (data && newInvoice) {
        // Add our new invoice to the beginning of the list and write it back
        cache.writeQuery({
          query: GET_INVOICES_QUERY,
          data: { invoices: [newInvoice, ...data.invoices] },
        });
      }
    },
    onCompleted: (data) => {
      // On success, redirect to the new invoice's details page
      router.push(`/dashboard/invoices/${data.createInvoice.id}`);
    },
  });
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };
  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gstAmount = subtotal * 0.1;
  const totalAmount = subtotal + gstAmount;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createInvoice({
      variables: {
        input: {
          projectId,
          invoiceNumber,
          dueDate: new Date(dueDate),
          items: items.map(({ description, quantity, unitPrice }) => ({ description, quantity, unitPrice })),
        },
      },
    });
  };

  if (projectsLoading) return <p>Loading projects...</p>;

  // ... (The rest of your form JSX is the same)
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create New Invoice</h1>
        
        <div className={styles.inputGroup}>
          <label htmlFor="project" className={styles.label}>Project</label>
          <select id="project" value={projectId} onChange={(e) => setProjectId(e.target.value)} required className={styles.input}>
            <option value="" disabled>Select a Project</option>
            {projectsData?.projects.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="invoiceNumber" className={styles.label}>Invoice Number</label>
          <input id="invoiceNumber" type="text" placeholder="e.g., INV-001" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required className={styles.input} />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="dueDate" className={styles.label}>Due Date</label>
          <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className={styles.input} />
        </div>

        <table className={styles.itemsTable}>
          <thead>
            <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
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

        <div className={styles.totals}>
          <p><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p>
          <p><span>GST (10%):</span> <span>${gstAmount.toFixed(2)}</span></p>
          <p className={styles.totalAmount}><span>Total:</span> <span>${totalAmount.toFixed(2)}</span></p>
        </div>

        <div className={styles.buttonGroup}>
          <Button type="submit" disabled={isCreating}>{isCreating ? 'Creating...' : 'Create Invoice'}</Button>
          <Button href="/dashboard/invoices" variant="secondary">Cancel</Button>
        </div>
      </form>
    </div>
  );
}