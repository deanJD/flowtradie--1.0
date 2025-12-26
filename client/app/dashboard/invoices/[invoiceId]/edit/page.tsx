'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';

import styles from '../../shared/InvoiceForm.module.css';
import Button from '@/components/Button/Button';

// ✅ Use your confirmed GraphQL ops
import { GET_INVOICE } from '@/app/lib/graphql/queries/invoice';
import { UPDATE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';

// --- Types (lightweight) ---
type ItemRow = { description: string; quantity: number; unitPrice: number };

export default function EditInvoicePage() {
  const router = useRouter();
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const { data, loading, error } = useQuery(GET_INVOICE, {
    variables: { invoiceId },
    fetchPolicy: 'cache-and-network',
  });

  const [updateInvoice, { loading: saving }] = useMutation(UPDATE_INVOICE_MUTATION);

  // --- Local form state ---
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDateStr, setIssueDateStr] = useState(''); // read-only on edit
  const [terms, setTerms] = useState<'0'|'1'|'3'|'7'|'14'|'30'|'custom'>('14');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'DRAFT'|'SENT'|'PAID'>('DRAFT');

  const [items, setItems] = useState<ItemRow[]>([{ description: '', quantity: 1, unitPrice: 0 }]);

  // Read-only client/project + from-business snapshot (gracefully blank if not in query)
  const [clientBlock, setClientBlock] = useState({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    projectTitle: '',
  });
  const [fromBusiness, setFromBusiness] = useState({
    businessName: '',
    abn: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
    bankDetails: '',
  });

  // --- Hydrate form from loaded invoice ---
  useEffect(() => {
    const inv = data?.invoice;
    if (!inv) return;

    setInvoiceNumber(inv.invoiceNumber ?? '');

    // Dates → "YYYY-MM-DD"
    const toYMD = (d?: string | null) => (d ? new Date(d).toISOString().split('T')[0] : '');
    const issue = toYMD(inv.issueDate);
    const due = toYMD(inv.dueDate);

    setIssueDateStr(issue);
    setDueDate(due);

    // Derive terms from (due - issue); else 'custom'
    if (issue && due) {
      const start = new Date(issue + 'T00:00:00Z');
      const end = new Date(due + 'T00:00:00Z');
      const diffDays = Math.round((+end - +start) / (1000 * 60 * 60 * 24));
      const known = ['0','1','3','7','14','30'] as const;
      if (known.includes(String(diffDays) as any)) setTerms(String(diffDays) as any);
      else setTerms('custom');
    } else {
      setTerms('custom');
    }

    setNotes(inv.notes ?? '');
    setStatus((inv.status as any) ?? 'DRAFT');

    // Items → editable rows
    const editRows: ItemRow[] = (inv.items ?? []).map((it: any) => ({
      description: it.description ?? '',
      quantity: Number(it.quantity ?? 1),
      unitPrice: Number(it.unitPrice ?? 0),
    }));
    setItems(editRows.length ? editRows : [{ description: '', quantity: 1, unitPrice: 0 }]);

    // Client/project block (read-only)
    setClientBlock({
      clientName: inv.project?.client?.name ?? '',
      clientAddress: inv.project?.client?.address ?? '',
      clientPhone: inv.project?.client?.phone ?? '',
      clientEmail: inv.project?.client?.email ?? '',
      projectTitle: inv.project?.title ?? '',
    });

    // Snapshot (read-only): these may not be in the current query; default to blanks
    setFromBusiness({
      businessName: (inv as any).businessName ?? '',
      abn: (inv as any).abn ?? '',
      address: (inv as any).address ?? '',
      phone: (inv as any).phone ?? '',
      email: (inv as any).email ?? '',
      website: (inv as any).website ?? '',
      logoUrl: (inv as any).logoUrl ?? '',
      bankDetails: (inv as any).bankDetails ?? '',
    });
  }, [data]);

  // --- Derived totals (client-side preview only; server is source of truth) ---
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0),
    [items]
  );
  const gstRate = data?.invoice?.gstRate ?? 0.1;
  const gstAmount = subtotal * gstRate;
  const totalAmount = subtotal + gstAmount;

  // --- Handlers ---
  const handleItemChange = (index: number, field: keyof ItemRow, value: string | number) => {
    setItems(prev =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]:
                field === 'description'
                  ? String(value)
                  : Number(value) || 0,
            }
          : row
      )
    );
  };

  const addItem = () => setItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => {
    setItems(prev => (prev.length <= 1 ? [{ description: '', quantity: 1, unitPrice: 0 }] : prev.filter((_, i) => i !== index)));
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newManualDate = e.target.value;
    setDueDate(newManualDate);
    if (terms !== 'custom' && issueDateStr) {
      const parts = issueDateStr.split('-');
      const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
      const daysToAdd = parseInt(terms, 10);
      if (!isNaN(daysToAdd)) {
        date.setUTCDate(date.getUTCDate() + daysToAdd);
        const calculated = date.toISOString().split('T')[0];
        if (newManualDate && calculated && newManualDate !== calculated) setTerms('custom');
      }
    }
  };

  useEffect(() => {
    if (terms !== 'custom' && issueDateStr) {
      const parts = issueDateStr.split('-');
      const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
      const daysToAdd = parseInt(terms, 10);
      if (!isNaN(daysToAdd)) {
        date.setUTCDate(date.getUTCDate() + daysToAdd);
        setDueDate(date.toISOString().split('T')[0]);
      }
    }
  }, [terms, issueDateStr]);

  // --- Save: send only fields supported by UpdateInvoiceInput ---
  const handleSave = async () => {
    if (!dueDate) {
      alert('Please ensure a Due Date is set.');
      return;
    }

    const itemsForMutation = items
      .map(i => ({
        description: i.description,
        quantity: Number(i.quantity) || 0,
        unitPrice: Number(i.unitPrice) || 0,
      }))
      .filter(i => i.description);

    try {
      await updateInvoice({
        variables: {
          updateInvoiceId: invoiceId,
          input: {
            invoiceNumber,
            status,
            notes,
            gstRate, // keep same unless you expose editing this
            // ✅ Send ISO string for DateTime
            dueDate: new Date(dueDate + 'T00:00:00Z').toISOString(),
            items: itemsForMutation,
          },
        },
      });

      router.push(`/dashboard/invoices/${invoiceId}/preview`);
    } catch (err: any) {
      console.error(err);
      alert(`❌ Failed to update invoice: ${err.message}`);
    }
  };

  // --- Render ---
  if (loading) return <div className={styles.loading}>Loading invoice…</div>;
  if (error)   return <div className={styles.error}>Error: {error.message}</div>;
  if (!data?.invoice) return <div className={styles.error}>Invoice not found.</div>;

  return (
    <div className={styles.container}>
      <form className={styles.invoiceForm} onSubmit={(e) => { e.preventDefault(); void handleSave(); }}>
        {/* HEADER */}
        <header className={styles.header}>
          <h1 className={styles.title}>Edit Invoice</h1>
        </header>

        {/* === FROM / BILL TO / PROJECT === */}
        <section className={styles.metaGrid}>
          {/* FROM (Business Info) – read-only on edit */}
          <div>
            <h3 className={styles.subSectionTitle}>From (Your Business Info)</h3>
            {[
              ['businessName','Business Name'],
              ['abn','ABN'],
              ['address','Address'],
              ['phone','Phone'],
              ['email','Email'],
            ].map(([key,label]) => (
              <div key={key} className={styles.inputGroup}>
                <label htmlFor={`from-${key}`} className={styles.label}>{label}</label>
                <input
                  id={`from-${key}`}
                  type={key === 'email' ? 'email' : 'text'}
                  className={styles.input}
                  value={(fromBusiness as any)[key]}
                  readOnly
                />
              </div>
            ))}
          </div>

          {/* BILL TO (Client Info) – read-only on edit */}
          <div>
            <h3 className={styles.subSectionTitle}>Bill To</h3>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Client</label>
              <input className={styles.input} value={clientBlock.clientName} readOnly />
            </div>

            <div className={`${styles.inputGroup} ${styles.projectInputGroup}`}>
              <label className={styles.label}>For Project</label>
              <input className={styles.input} value={clientBlock.projectTitle} readOnly />
            </div>

            <h3 className={styles.subSectionTitle}>Client Details</h3>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Address</label>
              <input className={styles.input} value={clientBlock.clientAddress} readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone</label>
              <input className={styles.input} value={clientBlock.clientPhone} readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} value={clientBlock.clientEmail} readOnly />
            </div>
          </div>
        </section>

        {/* === DETAILS GRID === */}
        <section className={styles.detailsGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="invoiceNumber" className={styles.label}>Invoice #</label>
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
            <label htmlFor="issueDate" className={styles.label}>Issue Date</label>
            <input
              id="issueDate"
              type="date"
              className={styles.input}
              value={issueDateStr}
              readOnly
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="terms" className={styles.label}>Terms</label>
            <select
              id="terms"
              className={styles.select}
              value={terms}
              onChange={(e) => setTerms(e.target.value as any)}
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
            <label htmlFor="dueDate" className={styles.label}>Due Date</label>
            <input
              id="dueDate"
              type="date"
              className={styles.input}
              value={dueDate}
              onChange={handleDueDateChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="status" className={styles.label}>Status</label>
            <select
              id="status"
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </section>

        {/* === ITEMS === */}
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
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      className={styles.tableInput}
                      value={it.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={styles.tableInput}
                      value={it.quantity}
                      min="0"
                      step="any"
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={styles.tableInput}
                      value={it.unitPrice}
                      min="0"
                      step="0.01"
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    />
                  </td>
                  <td className={styles.colTotal}>
                    ${((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)).toFixed(2)}
                  </td>
                  <td className={styles.colActions}>
                    <button type="button" className={styles.removeButton} onClick={() => removeItem(idx)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.addItemButtonContainer}>
            <Button type="button" onClick={addItem} variant="secondary">+ Add Item</Button>
          </div>
        </section>

        {/* === NOTES === */}
        <section>
          <h2 className={styles.sectionTitle}>Notes / Terms</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="notes" className={styles.label}>Notes</label>
            <textarea
              id="notes"
              className={styles.textarea}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </section>

        {/* === FOOTER === */}
        <footer>
          <div className={styles.totals}>
            <p><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p>
            <p><span>GST ({(gstRate * 100).toFixed(0)}%):</span> <span>${gstAmount.toFixed(2)}</span></p>
            <p className={styles.totalAmount}><span>Total:</span> <span>${totalAmount.toFixed(2)}</span></p>
          </div>

          <div className={styles.buttonGroup}>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save & Preview'}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}
