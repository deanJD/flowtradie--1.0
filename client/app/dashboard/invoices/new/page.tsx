'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';

import { GET_CLIENTS } from '@/app/lib/graphql/queries/clients'; // Make sure this query is clean too
import { GET_PROJECTS } from '@/app/lib/graphql/queries/projects';
import { GET_INVOICES } from '@/app/lib/graphql/queries/invoices'; // For cache update
import { CREATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';
import { GET_INVOICE_SETTINGS } from '@/app/lib/graphql/queries/invoiceSettings';

import styles from '../shared/InvoiceForm.module.css';
import Button from '@/components/Button/Button';

// --- Interfaces ---
interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Auto-select client if passed in URL (e.g. from Client Profile)
  const preselectedClientId = searchParams.get('clientId') || '';

  // --- State ---
  const [selectedClientId, setSelectedClientId] = useState(preselectedClientId);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // We display the next number for UI, but Backend determines the real one
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('...'); 
  
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [terms, setTerms] = useState('14');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<LineItem[]>([
    { description: 'Service Fee', quantity: 1, unitPrice: 0 },
  ]);

  // --- Data Fetching ---
  const { data: clientsData } = useQuery(GET_CLIENTS);
  const { data: projectsData } = useQuery(GET_PROJECTS);
  const { data: settingsData, loading: settingsLoading } = useQuery(GET_INVOICE_SETTINGS);

  const [createInvoice, { loading: isCreating }] = useMutation(CREATE_INVOICE_MUTATION, {
    // Basic cache update to show new invoice in list immediately
    refetchQueries: [{ query: GET_INVOICES }], 
    onCompleted: (data) => {
      router.push(`/dashboard/invoices/${data.createInvoice.id}`);
    },
  });

  // --- Derived Data ---
  const clientProjects = projectsData?.projects.filter(
    (p: any) => p.client.id === selectedClientId
  ) || [];

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxRate = settingsData?.invoiceSettings?.taxRate ?? 0; // ✅ Uses correct field
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  // --- Effects ---

  // 1. Auto-fill Defaults from Settings
  useEffect(() => {
    if (settingsData?.invoiceSettings) {
      const s = settingsData.invoiceSettings;
      
      // Prefix + Number (Visual only)
      const prefix = s.invoicePrefix || 'INV-';
      const num = s.startingNumber || 1000;
      setNextInvoiceNumber(`${prefix}${num}`);

      // Terms
      if (s.defaultDueDays) setTerms(s.defaultDueDays.toString());
      
      // Notes (Bank Details)
      if (!notes && s.bankDetails) setNotes(s.bankDetails);
    }
  }, [settingsData]);

  // 2. Auto-calc Due Date
  useEffect(() => {
    if (terms !== 'custom' && issueDate) {
      const date = new Date(issueDate);
      const days = parseInt(terms, 10);
      if (!isNaN(days)) {
        date.setDate(date.getDate() + days);
        setDueDate(date.toISOString().split('T')[0]);
      }
    }
  }, [issueDate, terms]);

  // --- Handlers ---
  const handleItemChange = (index: number, field: keyof LineItem, val: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return alert("Please select a project");

    try {
      await createInvoice({
        variables: {
          input: {
            projectId: selectedProjectId,
            issueDate: new Date(issueDate),
            dueDate: new Date(dueDate),
            notes,
            items: items.map(i => ({
              description: i.description,
              quantity: Number(i.quantity),
              unitPrice: Number(i.unitPrice)
            })),
            // We NO LONGER send business details. Backend does it.
          }
        }
      });
    } catch (err: any) {
      alert(`Failed to create invoice: ${err.message}`);
    }
  };

  if (settingsLoading) return <p>Loading...</p>;

  // ✅ Read-only Business Preview
  const business = settingsData?.invoiceSettings; 

  return (
    <div className={styles.container}>
      <form className={styles.invoiceForm} onSubmit={handleSubmit}>
        <header className={styles.header}>
          <h1 className={styles.title}>New Invoice</h1>
          <span className={styles.draftBadge}>DRAFT #{nextInvoiceNumber}</span>
        </header>

        <section className={styles.metaGrid}>
          
          {/* ✅ 1. READ-ONLY FROM SECTION */}
          <div className={styles.readOnlyCard}>
            <h3 className={styles.subSectionTitle}>From</h3>
            {business ? (
              <div className={styles.businessPreview}>
                {business.logoUrl && <img src={business.logoUrl} alt="Logo" className={styles.logoPreview} />}
                <strong>{business.businessName}</strong>
                <p>{business.abn}</p>
                <p>{business.address?.line1}</p>
                <p>{business.address?.city} {business.address?.state} {business.address?.postcode}</p>
                <br />
                <a href="/dashboard/settings" className={styles.editLink}>Edit Business Details</a>
              </div>
            ) : (
              <p>Loading business details...</p>
            )}
          </div>

          {/* ✅ 2. BILL TO (Client & Project) */}
          <div>
            <h3 className={styles.subSectionTitle}>Bill To</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Client</label>
              <select 
                className={styles.select}
                value={selectedClientId}
                onChange={(e) => { setSelectedClientId(e.target.value); setSelectedProjectId(''); }}
                required
              >
                <option value="" disabled>Select Client</option>
                {clientsData?.clients.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} {c.businessName ? `(${c.businessName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Project</label>
              <select
                className={styles.select}
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                disabled={!selectedClientId}
              >
                <option value="" disabled>Select Project</option>
                {clientProjects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ... DATES & ITEMS (Keep your existing table logic here) ... */}
        
        {/* FOOTER */}
        <footer>
          <div className={styles.totals}>
            <p><span>Subtotal:</span> ${subtotal.toFixed(2)}</p>
            <p><span>{business?.taxLabel || 'Tax'} ({taxRate * 100}%):</span> ${taxAmount.toFixed(2)}</p>
            <p className={styles.totalAmount}><span>Total:</span> ${totalAmount.toFixed(2)}</p>
          </div>
          
          <div className={styles.buttonGroup}>
             <Button type="submit" disabled={isCreating}>Create Invoice</Button>
          </div>
        </footer>

      </form>
    </div>
  );
}