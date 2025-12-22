// client/app/dashboard/invoices/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

import { GET_CLIENTS } from '@/app/lib/graphql/queries/clients';
import { GET_PROJECTS } from '@/app/lib/graphql/queries/projects';
import { GET_INVOICES } from '@/app/lib/graphql/queries/invoices';
import { CREATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';
import { GET_INVOICE_SETTINGS } from '@/app/lib/graphql/queries/invoiceSettings';

// ✅ Import our clean CSS
import styles from '../shared/InvoiceForm.module.css';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  
  // --- STATE ---
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('...'); 
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [terms, setTerms] = useState('14');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<LineItem[]>([
    { description: 'Service Fee', quantity: 1, unitPrice: 0 },
  ]);

  // --- DATA ---
  const { data: clientsData } = useQuery(GET_CLIENTS);
  const { data: projectsData } = useQuery(GET_PROJECTS);
  const { data: settingsData, loading: settingsLoading } = useQuery(GET_INVOICE_SETTINGS);

  const [createInvoice, { loading: isCreating }] = useMutation(CREATE_INVOICE_MUTATION, {
    refetchQueries: [{ query: GET_INVOICES }], 
    onCompleted: (data) => {
      router.push(`/dashboard/invoices/${data.createInvoice.id}`);
    },
  });

  // --- DERIVED DATA ---
  const clientProjects = projectsData?.projects.filter((p: any) => p.client.id === selectedClientId) || [];
  const selectedClient = clientsData?.clients.find((c: any) => c.id === selectedClientId);
  const business = settingsData?.invoiceSettings;

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxRate = business?.taxRate ?? 0;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  // --- EFFECTS ---
  
  // 1. Load Defaults from Settings
  useEffect(() => {
    if (business) {
      const prefix = business.invoicePrefix || 'INV-';
      const num = business.startingNumber || 1000;
      setNextInvoiceNumber(`${prefix}${num}`);
      
      if (business.defaultDueDays) setTerms(business.defaultDueDays.toString());
      
      // Only set notes if empty
      if (!notes && business.bankDetails) setNotes(business.bankDetails);
    }
  }, [business]);

  // 2. Calculate Due Date
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

  // --- HANDLERS ---
  const handleItemChange = (index: number, field: keyof LineItem, val: any) => {
    const newItems = [...items];
    const value = (field === 'quantity' || field === 'unitPrice') ? parseFloat(val) || 0 : val;
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!selectedProjectId) return alert("Please select a project");
    
    try {
      await createInvoice({
        variables: {
          input: {
            projectId: selectedProjectId,
            clientId: selectedClientId,
            invoiceNumber: nextInvoiceNumber, // ✅ Sending displayed number
            issueDate: new Date(issueDate),
            dueDate: new Date(dueDate),
            notes,
            items: items.map(i => ({
              description: i.description,
              quantity: Number(i.quantity),
              unitPrice: Number(i.unitPrice)
            })),
            taxRate: Number(taxRate),
            subtotal,
            taxAmount,
            totalAmount
          }
        }
      });
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  if (settingsLoading) return <div className={styles.pageWrapper}><p style={{padding: 40}}>Loading settings...</p></div>;

  return (
    <div className={styles.pageWrapper}>
      
      <header className={styles.stickyHeader}>
        <div className={styles.btnGroup}>
           <button className={styles.btnPreview}>Preview</button>
           <button className={styles.btnEdit}>Edit</button>
        </div>
        <div className={styles.btnGroup}>
           <button className={styles.actionBtn} onClick={() => router.back()}>Cancel</button>
           <button className={styles.primaryBtn} onClick={handleSubmit} disabled={isCreating}>
             {isCreating ? 'Sending...' : 'Save & Send'}
           </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.paper}>
          
          <div className={styles.topSection}>
            <div style={{ width: '40%' }}>
              <input className={styles.titleInput} defaultValue="Invoice" />
            </div>
            <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
              {business?.logoUrl ? (
                <img src={business.logoUrl} alt="Logo" style={{ maxHeight: '80px', objectFit: 'contain' }} />
              ) : (
                <div className={styles.logoBox} onClick={() => router.push('/dashboard/settings')}>
                  <span>+ Add Logo</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.twoColGrid}>
            
            {/* FROM */}
            <div>
              <h3 className={styles.sectionHeader}>From</h3>
              <div className={styles.fieldGrid}>
                <label className={styles.label}>Name</label>
                <input className={`${styles.input} ${styles.readOnlyInput}`} value={business?.businessName || ''} disabled />

                <label className={styles.label}>Email</label>
                <input className={`${styles.input} ${styles.readOnlyInput}`} value={business?.email || ''} disabled />

                <label className={styles.label} style={{ alignSelf: 'start', marginTop: 6 }}>Address</label>
                <div className={`${styles.input} ${styles.readOnlyInput} ${styles.addressBox}`}>
                    {business?.address?.line1}<br/>
                    {business?.address?.city} {business?.address?.state} {business?.address?.postcode}
                </div>

                <label className={styles.label}>ABN</label>
                {/* ✅ Using 'abn' as returned by your Service */}
                <input className={`${styles.input} ${styles.readOnlyInput}`} value={business?.abn || ''} disabled />
              </div>
            </div>

            {/* BILL TO */}
            <div>
              <h3 className={styles.sectionHeader}>Bill To</h3>
              <div className={styles.fieldGrid}>
                <label className={styles.label}>Client</label>
                <select 
                  className={styles.select}
                  value={selectedClientId}
                  onChange={(e) => { setSelectedClientId(e.target.value); setSelectedProjectId(''); }}
                >
                  <option value="" disabled>Select Client</option>
                  {clientsData?.clients.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} {c.businessName ? `(${c.businessName})` : ''}
                    </option>
                  ))}
                </select>

                <label className={styles.label}>Project</label>
                <select
                  className={styles.select}
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={!selectedClientId}
                >
                  <option value="" disabled>Select Project</option>
                  {clientProjects.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>

                {/* META DATA */}
                <div style={{ gridColumn: '1/-1', borderTop: '1px dashed #ddd', marginTop: 16, paddingTop: 16, display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, alignItems: 'center' }}>
                    <label className={styles.label}>Invoice #</label>
                    <input className={`${styles.input} ${styles.readOnlyInput}`} value={nextInvoiceNumber} disabled />

                    <label className={styles.label}>Issued</label>
                    <input className={styles.input} type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />

                    <label className={styles.label}>Due</label>
                    <input className={styles.input} type="date" value={dueDate} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div style={{ marginTop: '3rem' }}>
            <div className={styles.itemsHeader}>
              <div></div>
              <div>Description</div>
              <div style={{ textAlign: 'right' }}>Rate</div>
              <div style={{ textAlign: 'center' }}>Qty</div>
              <div style={{ textAlign: 'right' }}>Amount</div>
              <div style={{ textAlign: 'center' }}>Tax</div>
            </div>

            {items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <button className={styles.removeBtn} onClick={() => removeItem(index)}>×</button>
                <input 
                  className={styles.input} 
                  value={item.description}
                  onChange={e => handleItemChange(index, 'description', e.target.value)}
                />
                <input 
                  className={styles.input} 
                  type="number" 
                  style={{ textAlign: 'right' }}
                  value={item.unitPrice}
                  onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                />
                <input 
                  className={styles.input} 
                  type="number" 
                  style={{ textAlign: 'center' }}
                  value={item.quantity}
                  onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                />
                <div style={{ textAlign: 'right', fontWeight: 600, paddingTop: 8 }}>
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </div>
                <div style={{ textAlign: 'center', color: '#666', paddingTop: 8, fontSize: '0.8rem' }}>
                  {(taxRate * 100).toFixed(0)}%
                </div>
              </div>
            ))}
            <button className={styles.addBtn} onClick={addItem}>+ Add Line Item</button>
          </div>

          {/* TOTALS */}
          <div className={styles.totalsSection}>
            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className={styles.balanceRow}>
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div style={{ marginTop: '2rem', maxWidth: '60%' }}>
            <label className={styles.label} style={{ display: 'block', textAlign: 'left', marginBottom: 8 }}>Notes / Payment Details</label>
            <textarea 
              className={styles.textarea} 
              rows={4} 
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

        </div>
      </main>

      <div className={styles.floatingFooter}>
        <button className={styles.closeBtn} onClick={() => router.push('/dashboard/invoices')}>
          Close without saving
        </button>
      </div>
    </div>
  );
}