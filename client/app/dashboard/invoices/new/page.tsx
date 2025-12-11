'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';

import { GET_CLIENTS } from '@/app/lib/graphql/queries/clients';
import { GET_PROJECTS} from '@/app/lib/graphql/queries/projects';
import { GET_INVOICES } from '@/app/lib/graphql/queries/invoices';
import { CREATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';
import { GET_INVOICE_SETTINGS } from '@/app/lib/graphql/queries/invoiceSettings';

import styles from '../shared/InvoiceForm.module.css';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('clientId') || '';

  const [selectedClientId, setSelectedClientId] = useState(preselectedClientId);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('...'); 
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [terms, setTerms] = useState('14');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<LineItem[]>([
    { description: 'Service Fee', quantity: 1, unitPrice: 0 },
  ]);

  const { data: clientsData } = useQuery(GET_CLIENTS);
  const { data: projectsData } = useQuery(GET_PROJECTS);
  const { data: settingsData, loading: settingsLoading } = useQuery(GET_INVOICE_SETTINGS);

  const [createInvoice, { loading: isCreating }] = useMutation(CREATE_INVOICE_MUTATION, {
    refetchQueries: [{ query: GET_INVOICES}], 
    onCompleted: (data) => {
      router.push(`/dashboard/invoices/${data.createInvoice.id}`);
    },
  });

  const clientProjects = projectsData?.projects.filter((p: any) => p.client.id === selectedClientId) || [];
  
  // Find selected client details for read-only fields
  const selectedClient = clientsData?.clients.find((c: any) => c.id === selectedClientId);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxRate = settingsData?.invoiceSettings?.taxRate ?? 0;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  // Effects
  useEffect(() => {
    if (settingsData?.invoiceSettings) {
      const s = settingsData.invoiceSettings;
      const prefix = s.invoicePrefix || 'INV-';
      const num = s.startingNumber || 1000;
      setNextInvoiceNumber(`${prefix}${num}`);
      if (s.defaultDueDays) setTerms(s.defaultDueDays.toString());
      if (!notes && s.bankDetails) setNotes(s.bankDetails);
    }
  }, [settingsData]);

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
      alert(`Error: ${err.message}`);
    }
  };

  if (settingsLoading) return <p>Loading...</p>;
  const business = settingsData?.invoiceSettings;

  return (
    <div className={styles.pageWrapper}>
      
      {/* === HEADER === */}
      <header className={styles.stickyHeader}>
        <div className={styles.btnGroup}>
           <button className={styles.btnPreview}>Preview</button>
           <button className={styles.btnEdit}>Edit</button>
        </div>
        <div className={styles.btnGroup}>
           <button className={styles.actionBtn}>PDF</button>
           <button className={styles.primaryBtn} onClick={handleSubmit} disabled={isCreating}>
             {isCreating ? 'Sending...' : 'Email Invoice'}
           </button>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className={styles.mainContent}>
        <div className={styles.paper}>
          
          {/* Top Row */}
          <div className={styles.topSection}>
            <div style={{ width: '40%' }}>
              <input 
                className={styles.titleInput} 
                defaultValue="Invoice" 
              />
            </div>
            <div style={{ width: '30%' }}>
              {business?.logoUrl ? (
                <img src={business.logoUrl} alt="Logo" style={{ maxHeight: '8rem', maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <div className={styles.logoBox}>
                  <span>+ Logo</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.twoColGrid}>
            
            {/* FROM (Read Only - Styled as Inputs) */}
            <div>
              <h3 className={styles.sectionHeader}>From</h3>
              <div className={styles.fieldGrid}>
                <label className={styles.label}>Name</label>
                <input className={`${styles.input} ${styles.readOnlyInput}`} value={business?.businessName || ''} disabled />

                <label className={styles.label}>Email</label>
                <input className={`${styles.input} ${styles.readOnlyInput}`} value={business?.email || ''} disabled />

                <label className={styles.label} style={{ alignSelf: 'start' }}>Address</label>
                <div className={`${styles.input} ${styles.readOnlyInput}`} style={{ minHeight: '80px' }}>
                    {business?.address?.line1}<br/>
                    {business?.address?.city}, {business?.address?.state} {business?.address?.postcode}
                </div>

                <label className={styles.label}>ABN</label>
                <input className={`${styles.input} ${styles.readOnlyInput}`} value={business?.abn || ''} disabled />
              </div>

              <div style={{ paddingLeft: '80px', marginTop: '0.5rem' }}>
                 <a href="/dashboard/settings" style={{ fontSize: '0.75rem', color: '#2563eb' }}>Show additional business details</a>
              </div>

              {/* Meta Data */}
              <div className={styles.fieldGrid} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                <label className={styles.label}>Number</label>
                <input className={`${styles.input} ${styles.readOnlyInput}`} value={nextInvoiceNumber} disabled />

                <label className={styles.label}>Date</label>
                <input className={styles.input} type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />

                <label className={styles.label}>Terms</label>
                <select className={styles.select} value={terms} onChange={e => setTerms(e.target.value)}>
                  <option value="0">Due on receipt</option>
                  <option value="custom">Custom</option>
                  <option value="2">2 Days</option>
                  <option value="4">4 Days</option>
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                  
                </select>
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

                <label className={styles.label}>Email</label>
                <input 
                    className={`${styles.input} ${styles.readOnlyInput}`} 
                    value={selectedClient?.email || ''} 
                    placeholder="Auto-filled from Client"
                    disabled 
                />

                <label className={styles.label} style={{ alignSelf: 'start' }}>Address</label>
                <textarea 
                  className={`${styles.textarea} ${styles.readOnlyInput}`} 
                  rows={3} 
                  value={selectedClient?.addresses?.[0]?.line1 || ''}
                  placeholder="Auto-filled from Client" 
                  disabled 
                />
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div style={{ marginTop: '3rem' }}>
            <div className={styles.itemsHeader}>
              <div></div>
              <div>Description</div>
              <div style={{ textAlign: 'right' }}>Rate</div>
              <div style={{ textAlign: 'center' }}>Qty</div>
              <div style={{ textAlign: 'right' }}>Amount</div>
              <div style={{ textAlign: 'center' }}>GST</div>
            </div>

            {items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <button className={styles.removeBtn} onClick={() => removeItem(index)}>×</button>
                
                <div>
                  <input 
                    className={styles.input} 
                    value={item.description}
                    placeholder="Item Description"
                    onChange={e => handleItemChange(index, 'description', e.target.value)}
                  />
                  <button className={styles.aiBadge}>✨ Improve with AI</button>
                </div>

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

                <div style={{ textAlign: 'right', paddingTop: '0.5rem', fontWeight: 500 }}>
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
                  <input type="checkbox" checked disabled />
                </div>
              </div>
            ))}

            <div style={{ borderBottom: '1px dashed #d1d5db', margin: '1.5rem 0' }}></div>
            <button className={styles.addBtn} onClick={addItem}>+ Add Item</button>
          </div>

          {/* TOTALS */}
          <div className={styles.totalsSection}>
            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>GST ({(taxRate * 100).toFixed(0)}%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow} style={{ fontWeight: 600, color: '#111827' }}>
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className={styles.balanceRow}>
                <span>Balance Due</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* NOTES & EXTRAS */}
          <div style={{ marginTop: '2rem' }}>
            <label className={styles.label} style={{ marginBottom: 8, display: 'block' }}>Notes:</label>
            <textarea 
              className={styles.textarea} 
              rows={4} 
              placeholder="Notes - any relevant information..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button className={styles.aiBadge}>✨ Improve with AI</button>
          </div>

          {/* LOCKED FEATURES (Placeholder) */}
          <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                 <span style={{ color: '#f97316' }}>🔒</span> Signature
               </div>
            </div>
            <div>
               <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>Photos</div>
               <button style={{ width: '100%', height: '6rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', background: 'white', color: '#6b7280', cursor: 'not-allowed' }}>
                 <span style={{ color: '#f97316' }}>🔒</span> Add Photo
               </button>
            </div>
          </div>

        </div>
      </main>

      {/* FLOATING CLOSE BUTTON */}
      <div className={styles.floatingFooter}>
        <button className={styles.closeBtn} onClick={() => router.push('/dashboard/invoices')}>
          Close Invoice
        </button>
      </div>

    </div>
  );
}