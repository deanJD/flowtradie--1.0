// client/app/dashboard/invoices/new/page.tsx (Save & Preview Workflow)
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

// GraphQL Imports
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects';
import { GET_INVOICES_QUERY } from '@/app/lib/graphql/queries/invoices';
import { CREATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';

// Component Imports
import styles from './NewInvoicePage.module.css';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';

// --- Interfaces ---
interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Client {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface Project {
  id: string;
  title: string;
  client: { id: string };
}

// --- Component ---
export default function NewInvoicePage() {
  const router = useRouter();

  // --- State ---
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [terms, setTerms] = useState('14');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // --- Data Fetching & Mutation ---
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useQuery<{ clients: Client[] }>(GET_CLIENTS_QUERY);
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY);
  const [createInvoice, { loading: isCreating, error: createError }] = useMutation(CREATE_INVOICE_MUTATION, {
    update(cache, { data: { createInvoice: newInvoice } }) {
      const existingData = cache.readQuery<{ invoices: any[] }>({ query: GET_INVOICES_QUERY });
      if (existingData && newInvoice) {
        cache.writeQuery({
          query: GET_INVOICES_QUERY,
          data: { invoices: [newInvoice, ...existingData.invoices] },
        });
      }
    },
    // vvvvv CHANGE 1: UPDATE REDIRECT DESTINATION vvvvv
    onCompleted: (data) => {
      // Redirect to the PREVIEW page of the newly created invoice
      router.push(`/dashboard/invoices/${data.createInvoice.id}/preview`);
    },
    // ^^^^^ CHANGE 1: UPDATE REDIRECT DESTINATION ^^^^^
  });

  // --- Derived State & Calculations ---
  const selectedClient = clientsData?.clients.find((c) => c.id === selectedClientId);
  const clientProjects = projectsData?.projects.filter((p) => p.client.id === selectedClientId);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const gstAmount = subtotal * 0.1;
  const totalAmount = subtotal + gstAmount;

  // --- Effects ---
  useEffect(() => {
    if (selectedClient) {
      setClientAddress(selectedClient.address || '');
      setClientPhone(selectedClient.phone || '');
      setClientEmail(selectedClient.email || '');
    } else {
      setClientAddress(''); setClientPhone(''); setClientEmail('');
    }
  }, [selectedClient]);

  useEffect(() => {
    if (terms !== 'custom' && issueDate) {
        const parts = issueDate.split('-');
        const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
        const daysToAdd = parseInt(terms, 10);
        if (!isNaN(daysToAdd)) {
          date.setUTCDate(date.getUTCDate() + daysToAdd);
          setDueDate(date.toISOString().split('T')[0]);
        } else { setDueDate(''); }
    } else if (!issueDate) { setDueDate(''); }
  }, [issueDate, terms]);

  // --- Handlers ---
  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        const numericValue = (field === 'quantity' || field === 'unitPrice') ? (parseFloat(value.toString()) || 0) : value;
        return { ...item, [field]: numericValue };
      }
      return item;
    });
    setItems(newItems);
  };

  const addItem = () => { setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]); };
  const removeItem = (index: number) => { if (items.length <= 1) { setItems([{ description: '', quantity: 1, unitPrice: 0 }]); return; } setItems(items.filter((_, i) => i !== index)); };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newManualDate = e.target.value;
    setDueDate(newManualDate);
    let calculatedDate = '';
    if (terms !== 'custom' && issueDate) {
         const parts = issueDate.split('-');
         const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
         const daysToAdd = parseInt(terms, 10);
         if (!isNaN(daysToAdd)) { date.setUTCDate(date.getUTCDate() + daysToAdd); calculatedDate = date.toISOString().split('T')[0]; }
    }
    if (terms !== 'custom' && newManualDate && calculatedDate && newManualDate !== calculatedDate) { setTerms('custom'); }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProjectId) { alert("Please select a project."); return; }
    const itemsForMutation = items.map(item => ({ description: item.description, quantity: Number(item.quantity) || 0, unitPrice: Number(item.unitPrice) || 0 })).filter(item => item.description);
    if (itemsForMutation.length === 0) { alert("Please add at least one item with a description."); return; }
    if (!dueDate) { alert("Please ensure a Due Date is set."); return; }

    const dueParts = dueDate.split('-');
    const finalDueDate = new Date(Date.UTC(Number(dueParts[0]), Number(dueParts[1]) - 1, Number(dueParts[2])));
    const issueParts = issueDate.split('-');
    const finalIssueDate = new Date(Date.UTC(Number(issueParts[0]), Number(issueParts[1]) - 1, Number(issueParts[2])));

    createInvoice({
      variables: {
        input: {
          projectId: selectedProjectId, invoiceNumber, issueDate: finalIssueDate,
          dueDate: finalDueDate, notes, items: itemsForMutation,
        },
      },
    });
  };

  // --- Loading & Error States ---
  if (clientsLoading || projectsLoading) return <p>Loading client and project data...</p>;
  if (clientsError) return <p>Error loading clients: {clientsError.message}</p>;
  if (projectsError) return <p>Error loading projects: {projectsError.message}</p>;

  // --- Render ---
  return (
    <div className={styles.container}>
      <form className={styles.invoiceForm} onSubmit={handleSubmit}>
        {/* === HEADER === */}
        <header className={styles.header}>
          <h1 className={styles.title}>Create Invoice</h1>
          {/* Removed href from Preview button */}
          <Button variant="secondary" type="button">Preview</Button>
        </header>

        {/* === BILL TO / FROM / PROJECT GRID === */}
        <section className={styles.metaGrid}>
          {/* Column 1: BILL TO */}
          <div>
            <div className={styles.inputGroup}>
              <label htmlFor="client" className={styles.label}>Bill To (Select Client):</label>
              <select id="client" className={styles.select} value={selectedClientId} onChange={(e) => { setSelectedClientId(e.target.value); setSelectedProjectId(''); }} required>
                <option value="" disabled>Select a Client</option>
                {clientsData?.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {selectedClient && ( <div className={styles.clientDetails}><p className={styles.clientName}>{selectedClient.name}</p></div> )}
            {selectedClientId && (
              <>
                <h3 className={styles.subSectionTitle}>Client Details</h3>
                <Input label="Address" id="clientAddress" type="text" placeholder="Client's Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
                <Input label="Phone" id="clientPhone" type="tel" placeholder=" Phone/Mobile" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                <Input label="Email" id="clientEmail" type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </>
            )}
          </div>
          {/* Column 2: FROM & PROJECT */}
          <div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>From:</label>
              <div className={styles.fromDetails}><p className={styles.fromName}>Your Company Name</p><p>123 Main Street</p><p>Your City, State, 12345</p></div>
            </div>
            <div className={`${styles.inputGroup} ${styles.projectInputGroup}`}>
              <label htmlFor="project" className={styles.label}>For Project:</label>
              <select id="project" className={styles.select} value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} required disabled={!selectedClientId || !clientProjects || clientProjects.length === 0}>
                <option value="" disabled>{!selectedClientId ? 'Select a client first' : (clientProjects?.length === 0 ? 'No projects for this client' : 'Select a project')}</option>
                {clientProjects?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* === INVOICE # / DATES GRID === */}
        <section className={styles.detailsGrid}>
             <Input label="Invoice #" id="invoiceNumber" type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
             <Input label="Issue Date" id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
             <div className={styles.inputGroup}>
               <label htmlFor="terms" className={styles.label}>Terms</label>
               <select id="terms" className={styles.select} value={terms} onChange={(e) => setTerms(e.target.value)}>
                 <option value="0">Due on receipt</option>
                 <option value="1"> 1 Day</option>
                 <option value="3"> 3 Days</option>
                 <option value="7"> 7 Days</option>
                 <option value="14"> 14 Days</option>
                 <option value="30"> 30 Days</option>
                 <option value="custom">Custom</option>
               </select>
             </div>
             <Input label="Due Date" id="dueDate" type="date" value={dueDate} onChange={handleDueDateChange} required />
        </section>

        {/* === ITEMS Section === */}
        <section>
          <h2 className={styles.sectionTitle}>Items</h2>
          <table className={styles.itemsTable}>
            <thead><tr><th className={styles.colDescription}>Description</th><th className={styles.colQty}>Qty</th><th className={styles.colPrice}>Unit Price</th><th className={styles.colTotal}>Total</th><th className={styles.colActions}></th></tr></thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td data-label="Description"><input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className={styles.tableInput} placeholder="Item description" required /></td>
                  <td data-label="Qty"><input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className={styles.tableInput} min="0" step="any" /></td>
                  <td data-label="Unit Price"><input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} className={styles.tableInput} min="0" step="0.01" placeholder="0.00" /></td>
                  <td data-label="Total" className={styles.colTotal}>${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}</td>
                  <td data-label="Remove" className={styles.colActions}><button type="button" onClick={() => removeItem(index)} className={styles.removeButton}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.addItemButtonContainer}>
            <Button type="button" onClick={addItem} variant='secondary'>+ Add Item</Button>
          </div>
        </section>

        {/* === NOTES Section === */}
        <section>
          <h2 className={styles.sectionTitle}>Notes / Terms</h2>
          <div className={styles.inputGroup}><textarea className={styles.textarea} rows={3} placeholder="Enter notes or payment terms (e.g., bank details)..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea></div>
        </section>

        {/* === FOOTER === */}
        <footer>
          <div className={styles.totals}><p><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p><p><span>GST (10%):</span> <span>${gstAmount.toFixed(2)}</span></p><p className={styles.totalAmount}><span>Total:</span> <span>${totalAmount.toFixed(2)}</span></p></div>
          {createError && <p className={styles.errorMessage}>Error: {createError.message}</p>}
          <div className={styles.buttonGroup}>
            <Button href="/dashboard/invoices" variant="secondary" type="button">Cancel</Button>
            {/* vvvvv CHANGE 2: UPDATE BUTTON TEXT vvvvv */}
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Saving...' : 'Save & Preview'} {/* Changed Text */}
            </Button>
            {/* ^^^^^ CHANGE 2: UPDATE BUTTON TEXT ^^^^^ */}
          </div>
        </footer>
      </form>
    </div>
  );
}

