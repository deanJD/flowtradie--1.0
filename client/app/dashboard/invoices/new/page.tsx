'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

// --- GraphQL Imports ---
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects';
import { GET_INVOICES_QUERY } from '@/app/lib/graphql/queries/invoices';
import { CREATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';
import { GET_INVOICE_SETTINGS } from '@/app/lib/graphql/queries/invoiceSettings';
import { UPDATE_INVOICE_SETTINGS_NUMBER } from '@/app/lib/graphql/mutations/invoiceSettings';


// --- Component Imports ---
import styles from './NewInvoicePage.module.css';
import Button from '@/components/Button/Button';

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
  const [updateInvoiceSettings] = useMutation(UPDATE_INVOICE_SETTINGS_NUMBER);

  // --- Business info state ---
  const [fromBusiness, setFromBusiness] = useState({
    businessName: '',
    abn: '',
    address: '',
    phone: '',
    email: '',
  });

  // --- Data Fetching ---
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useQuery<{ clients: Client[] }>(GET_CLIENTS_QUERY);
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY);
  const { data: settingsData, loading: settingsLoading, error: settingsError } = useQuery(GET_INVOICE_SETTINGS);

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
    onCompleted: (data) => {
      router.push(`/dashboard/invoices/${data.createInvoice.id}/preview`);
    },
  });
  

  // --- Derived Data ---
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
      setClientAddress('');
      setClientPhone('');
      setClientEmail('');
    }
  }, [selectedClient]);

  useEffect(() => {
    if (settingsData?.invoiceSettings) {
      const s = settingsData.invoiceSettings;
      setFromBusiness({
        businessName: s.businessName || '',
        abn: s.abn || '',
        address: s.address || '',
        phone: s.phone || '',
        email: s.email || '',
      });
    }
  }, [settingsData]);

  useEffect(() => {
    if (terms !== 'custom' && issueDate) {
      const parts = issueDate.split('-');
      const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
      const daysToAdd = parseInt(terms, 10);
      if (!isNaN(daysToAdd)) {
        date.setUTCDate(date.getUTCDate() + daysToAdd);
        setDueDate(date.toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    } else if (!issueDate) {
      setDueDate('');
    }
  }, [issueDate, terms]);
  // Auto-fill invoice number when settings are loaded
useEffect(() => {
  if (settingsData?.invoiceSettings && !invoiceNumber) {
    const { invoicePrefix, startingNumber } = settingsData.invoiceSettings;
    const prefix = invoicePrefix || 'INV-';
    const nextNumber = startingNumber ? startingNumber.toString().padStart(3, '0') : '001';
    setInvoiceNumber(`${prefix}${nextNumber}`);
  }
}, [settingsData, invoiceNumber]);


  // --- Handlers ---
  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        const numericValue = field === 'quantity' || field === 'unitPrice' ? parseFloat(value.toString()) || 0 : value;
        return { ...item, [field]: numericValue };
      }
      return item;
    });
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => {
    if (items.length <= 1) {
      setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newManualDate = e.target.value;
    setDueDate(newManualDate);
    let calculatedDate = '';
    if (terms !== 'custom' && issueDate) {
      const parts = issueDate.split('-');
      const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
      const daysToAdd = parseInt(terms, 10);
      if (!isNaN(daysToAdd)) {
        date.setUTCDate(date.getUTCDate() + daysToAdd);
        calculatedDate = date.toISOString().split('T')[0];
      }
    }
    if (terms !== 'custom' && newManualDate && calculatedDate && newManualDate !== calculatedDate) {
      setTerms('custom');
    }
  };

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!selectedProjectId) {
    alert("Please select a project.");
    return;
  }

  const itemsForMutation = items
    .map((item) => ({
      description: item.description,
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
    }))
    .filter((item) => item.description);

  if (itemsForMutation.length === 0) {
    alert("Please add at least one item with a description.");
    return;
  }

  if (!dueDate) {
    alert("Please ensure a Due Date is set.");
    return;
  }

  const dueParts = dueDate.split("-");
  const finalDueDate = new Date(Date.UTC(Number(dueParts[0]), Number(dueParts[1]) - 1, Number(dueParts[2])));
  const issueParts = issueDate.split("-");
  const finalIssueDate = new Date(Date.UTC(Number(issueParts[0]), Number(issueParts[1]) - 1, Number(issueParts[2])));

  try {
    // ✅ Log the payload being sent
    console.log("Submitting invoice payload:", {
      projectId: selectedProjectId,
      invoiceNumber,
      issueDate: finalIssueDate,
      dueDate: finalDueDate,
      notes,
      items: itemsForMutation,
      ...fromBusiness,
    });

    // ✅ 1. Create the invoice with snapshot fields
    const { data } = await createInvoice({
      variables: {
        input: {
          projectId: selectedProjectId,
          invoiceNumber,
          issueDate: finalIssueDate,
          dueDate: finalDueDate,
          notes,
          items: itemsForMutation,
          gstRate: 0.1,
          businessName: fromBusiness.businessName,
          abn: fromBusiness.abn,
          address: fromBusiness.address,
          phone: fromBusiness.phone,
          email: fromBusiness.email,
          website: settingsData?.invoiceSettings?.website || null,
          logoUrl: settingsData?.invoiceSettings?.logoUrl || null,
          bankDetails: settingsData?.invoiceSettings?.bankDetails || null,
        },
      },
    });

    // ✅ Increment invoice number in settings after success
if (data?.createInvoice && settingsData?.invoiceSettings) {
  const { id, startingNumber = 1 } = settingsData.invoiceSettings;
  await updateInvoiceSettings({
    variables: {
      id,
      input: { startingNumber: startingNumber + 1 },
    },
  });
}


    // ✅ 3. Redirect to preview
    if (data?.createInvoice?.id) {
      router.push(`/dashboard/invoices/${data.createInvoice.id}/preview`);
    }
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    alert("Failed to create invoice. Check console for details.");
  }
};



  // --- Loading & Error States ---
  if (settingsLoading) return <p>Loading business settings...</p>;
  if (settingsError) return <p>Error loading settings: {settingsError.message}</p>;
  if (clientsLoading || projectsLoading) return <p>Loading client and project data...</p>;
  if (clientsError) return <p>Error loading clients: {clientsError.message}</p>;
  if (projectsError) return <p>Error loading projects: {projectsError.message}</p>;

  // --- Render ---
  return (
    <div className={styles.container}>
      <form className={styles.invoiceForm} onSubmit={handleSubmit}>
        <header className={styles.header}>
          <h1 className={styles.title}>Create Invoice</h1>
        </header>

        {/* === FROM / BILL TO / PROJECT === */}
        <section className={styles.metaGrid}>
          {/* FROM (Business Info) */}
          <div>
            <h3 className={styles.subSectionTitle}>From (Your Business Info)</h3>

            {['businessName', 'abn', 'address', 'phone', 'email'].map((field) => (
              <div key={field} className={styles.inputGroup}>
                <label htmlFor={field} className={styles.label}>
                  {field === 'businessName'
                    ? 'Business Name'
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  type={field === 'email' ? 'email' : 'text'}
                  className={styles.input}
                  value={(fromBusiness as any)[field]}
                  onChange={(e) =>
                    setFromBusiness({ ...fromBusiness, [field]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>

          {/* BILL TO (Client Info) */}
          <div>
            <h3 className={styles.subSectionTitle}>Bill To (Select Client)</h3>
            <div className={styles.inputGroup}>
              <label htmlFor="client" className={styles.label}>
                Client
              </label>
              <select
                id="client"
                className={styles.select}
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setSelectedProjectId('');
                }}
                required
              >
                <option value="" disabled>
                  Select a Client
                </option>
                {clientsData?.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles.inputGroup} ${styles.projectInputGroup}`}>
              <label htmlFor="project" className={styles.label}>
                For Project
              </label>
              <select
                id="project"
                className={styles.select}
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                disabled={!selectedClientId || !clientProjects || clientProjects.length === 0}
              >
                <option value="" disabled>
                  {!selectedClientId
                    ? 'Select a client first'
                    : clientProjects?.length === 0
                    ? 'No projects for this client'
                    : 'Select a project'}
                </option>
                {clientProjects?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedClientId && (
              <>
                <h3 className={styles.subSectionTitle}>Client Details</h3>
                <div className={styles.inputGroup}>
                  <label htmlFor="clientAddress" className={styles.label}>
                    Address
                  </label>
                  <input
                    id="clientAddress"
                    type="text"
                    className={styles.input}
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="clientPhone" className={styles.label}>
                    Phone
                  </label>
                  <input
                    id="clientPhone"
                    type="tel"
                    className={styles.input}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="clientEmail" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="clientEmail"
                    type="email"
                    className={styles.input}
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* === DETAILS GRID === */}
        <section className={styles.detailsGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="invoiceNumber" className={styles.label}>
              Invoice #
            </label>
            <input
              id="invoiceNumber"
              type="text"
              className={styles.input}
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="issueDate" className={styles.label}>
              Issue Date
            </label>
            <input
              id="issueDate"
              type="date"
              className={styles.input}
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="terms" className={styles.label}>
              Terms
            </label>
            <select
              id="terms"
              className={styles.select}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            >
              <option value="0">Due on receipt</option>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="dueDate" className={styles.label}>
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              className={styles.input}
              value={dueDate}
              onChange={handleDueDateChange}
              required
            />
          </div>
        </section>

        {/* === ITEMS SECTION === */}
        <section>
          <h2 className={styles.sectionTitle}>Items</h2>
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
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className={styles.tableInput}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className={styles.tableInput}
                      min="0"
                      step="any"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className={styles.tableInput}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className={styles.colTotal}>
                    ${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}
                  </td>
                  <td className={styles.colActions}>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.addItemButtonContainer}>
            <Button type="button" onClick={addItem} variant="secondary">
              + Add Item
            </Button>
          </div>
        </section>

        {/* === NOTES SECTION === */}
        <section>
          <h2 className={styles.sectionTitle}>Notes / Terms</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="notes" className={styles.label}>
              Notes
            </label>
            <textarea
              id="notes"
              className={styles.textarea}
              placeholder="Enter notes or payment terms (e.g. bank details)..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer>
          <div className={styles.totals}>
            <p>
              <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
            </p>
            <p>
              <span>GST (10%):</span> <span>${gstAmount.toFixed(2)}</span>
            </p>
            <p className={styles.totalAmount}>
              <span>Total:</span> <span>${totalAmount.toFixed(2)}</span>
            </p>
          </div>
          {createError && <p className={styles.errorMessage}>Error: {createError.message}</p>}
          <div className={styles.buttonGroup}>
            <Button href="/dashboard/invoices" variant="secondary" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Saving...' : 'Save & Preview'}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}
