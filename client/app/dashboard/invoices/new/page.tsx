// client/app/dashboard/invoices/new/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import styles from '../shared/InvoiceForm.module.css';

type LineItem = {
  id: string;
  description: string;
  qty: number;
  rate: number;
};

type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';

function formatMoney(amount: number, currencyCode: string) {
  // Safe, simple formatter. Replace with your own money util later if you have one.
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function uid(prefix = 'li') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export default function NewInvoicePage() {
  // ---- Page state (dummy / prototype). Wire to GraphQL later.
  const [status] = useState<InvoiceStatus>('DRAFT');

  const [invoiceNumber, setInvoiceNumber] = useState('INV-0004');
  const [poNumber, setPoNumber] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueInDays, setDueInDays] = useState(14);
  const [subject, setSubject] = useState('');

  const [clientId, setClientId] = useState('client_1');
  const [currencyCode, setCurrencyCode] = useState('AUD');

  // Business snapshot (should be read-only in FlowTradie)
  const business = {
    name: 'FlowTradie Pty Ltd',
    email: 'accounts@flowtradie.com',
    address: 'Street, Perth WA',
    postcode: '6000',
    phone: '0400 000 000',
    taxNumberLabel: 'ABN',
    taxNumber: '12 345 678 901',
  };

  // Client (selected)
  const clients = [
    { id: 'client_1', name: 'Bread & Roll Ltd.', email: 'accounts@breadandroll.com', address: 'Address', phone: '0400 111 222', mobile: '0400 333 444', taxNumber: '' },
    { id: 'client_2', name: 'Acme Builders', email: 'admin@acme.com', address: '42 Jobsite Rd', phone: '0412 000 999', mobile: '0412 222 888', taxNumber: '' },
  ];
  const selectedClient = clients.find((c) => c.id === clientId) ?? clients[0];

  // Tax (prototype). In your real app, this comes from Region/Business settings + service.
  const taxLabel = 'GST';
  const taxRate = 0.1;

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [items, setItems] = useState<LineItem[]>([
    { id: uid(), description: 'Service charges', qty: 1, rate: 125 },
    { id: uid(), description: 'Materials', qty: 1, rate: 55 },
  ]);

  // Extras: progressive disclosure
  const [showNotes, setShowNotes] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [notes, setNotes] = useState('');

  const dueDate = useMemo(() => {
    const d = new Date(issueDate);
    d.setDate(d.getDate() + Number(dueInDays || 0));
    return d.toISOString().slice(0, 10);
  }, [issueDate, dueInDays]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0),
    [items]
  );
  const taxAmount = useMemo(() => subtotal * taxRate, [subtotal]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  function addLineItem() {
    setItems((prev) => [
      ...prev,
      { id: uid(), description: '', qty: 1, rate: 0 },
    ]);
  }

  function updateLineItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeLineItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function onSave() {
    // Wire to createInvoice mutation later.
    // Keep UI snappy: optimistic save + toast.
    alert('Save (wire to GraphQL later)');
  }

  function onSaveAndSend() {
    alert('Save & Send (wire to GraphQL later)');
  }

  return (
    <div className={styles.page}>
     

      {/* Sticky action bar */}
      <div className={styles.stickyBar}>
        <div className={styles.stickyLeft}>
          <div className={styles.stickyTitle}>New invoice</div>
          <div className={styles.stickyMeta}>
            <span className={styles.metaLabel}>Invoice</span>
            <span className={styles.metaValue}>{invoiceNumber}</span>
            <span className={styles.dot}>•</span>
            <span className={`${styles.statusPill} ${styles[`status_${status}`]}`}>{status}</span>
          </div>
        </div>

        <div className={styles.stickyActions}>
          <button className={styles.btnSecondary} onClick={onSave}>Save</button>
          <button className={styles.btnSecondary} type="button">Preview</button>
          <button className={styles.btnSecondary} type="button">PDF</button>
          <button className={styles.btnPrimary} onClick={onSaveAndSend}>Save &amp; Send</button>
        </div>
      </div>

      {/* Page header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.h1}>New invoice  {selectedClient.name}</h1>
          <p className={styles.sub}>Create and send a new invoice to your client.</p>
        </div>

      </div>

      {/* Invoice card */}
      <div className={styles.card}>
        {/* Meta grid */}
        <div className={styles.metaGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Invoice number</label>
            <input
              className={styles.input}
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Client</label>
            <select
              className={styles.input}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>PO number</label>
            <input
              className={styles.input}
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Issue date</label>
            <input
              className={styles.input}
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Due date</label>
            <select
              className={styles.input}
              value={dueInDays}
              onChange={(e) => setDueInDays(Number(e.target.value))}
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={21}>21 days</option>
              <option value={30}>30 days</option>
            </select>
            <div className={styles.hint}>Due: {dueDate}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Logo</label>
            <label className={styles.logoDrop}>
              <input
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              />
              <div className={styles.logoDropInner}>
                <div className={styles.logoDropTitle}>{logoFile ? logoFile.name : '+ Add Logo'}</div>
                <div className={styles.logoDropSub}>PNG/JPG</div>
              </div>
            </label>
          </div>

          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>Subject</label>
            <input
              className={styles.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Kitchen renovation progress claim"
            />
          </div>
        </div>

        {/* From / Bill To */}
        <div className={styles.divider} />
        <div className={styles.twoCol}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>From</div>
            <div className={styles.panelGrid}>
              <input className={styles.input} value={business.name} readOnly />
              <input className={styles.input} value={business.email} readOnly />
              <input className={styles.input} value={business.address} readOnly />
              <div className={styles.panelRow2}>
                <input className={styles.input} value={business.postcode} readOnly />
                <input className={styles.input} value={business.phone} readOnly />
              </div>
              <div className={styles.smallLink} role="button" tabIndex={0}>
                Show additional details
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>Bill To</div>
            <div className={styles.panelGrid}>
              <input className={styles.input} value={selectedClient.name} readOnly />
              <input className={styles.input} value={selectedClient.email} readOnly />
              <input className={styles.input} value={selectedClient.address} readOnly />
              <div className={styles.panelRow2}>
                <input className={styles.input} value={selectedClient.phone} readOnly />
                <input className={styles.input} value={selectedClient.mobile} readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className={styles.divider} />
        <div className={styles.items}>
          <div className={styles.itemsHeader}>
            <div className={styles.itemsTitle}>Line items</div>
            <button className={styles.btnSmall} type="button" onClick={addLineItem}>
              + Add line item
            </button>
          </div>

          <div className={styles.table}>
            <div className={styles.thead}>
              <div className={styles.thDesc}>Description</div>
              <div className={styles.thNum}>Qty</div>
              <div className={styles.thNum}>Rate</div>
              <div className={styles.thAmount}>Amount</div>
              <div className={styles.thTrash} />
            </div>

            {items.map((it) => {
              const lineTotal = (Number(it.qty) || 0) * (Number(it.rate) || 0);
              return (
                <div key={it.id} className={styles.tr}>
                  <div className={styles.tdDesc}>
                    <input
                      className={styles.input}
                      value={it.description}
                      onChange={(e) => updateLineItem(it.id, { description: e.target.value })}
                      placeholder="Description"
                    />
                  </div>

                  <div className={styles.tdNum}>
                    <input
                      className={styles.input}
                      inputMode="decimal"
                      value={String(it.qty)}
                      onChange={(e) => updateLineItem(it.id, { qty: Number(e.target.value) })}
                    />
                  </div>

                  <div className={styles.tdNum}>
                    <input
                      className={styles.input}
                      inputMode="decimal"
                      value={String(it.rate)}
                      onChange={(e) => updateLineItem(it.id, { rate: Number(e.target.value) })}
                    />
                  </div>

                  <div className={styles.tdAmount}>
                    <div className={styles.amountText}>{formatMoney(lineTotal, currencyCode)}</div>
                  </div>

                  <div className={styles.tdTrash}>
                    <button
                      className={styles.iconBtn}
                      type="button"
                      onClick={() => removeLineItem(it.id)}
                      aria-label="Remove line item"
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes + Totals */}
        <div className={styles.divider} />
        <div className={styles.bottomGrid}>
          <div className={styles.notesBlock}>
            <div className={styles.blockHeader}>
              <div className={styles.blockTitle}>Notes</div>
              {!showNotes ? (
                <button className={styles.btnLink} type="button" onClick={() => setShowNotes(true)}>
                  + Add notes
                </button>
              ) : (
                <button className={styles.btnLink} type="button" onClick={() => setShowNotes(false)}>
                  Hide
                </button>
              )}
            </div>

            {showNotes && (
              <>
                <textarea
                  className={styles.textarea}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any relevant information not covered, additional terms and conditions..."
                />
                <button className={styles.btnAi} type="button">
                  ✨ Improve (optional)
                </button>
              </>
            )}

            <div className={styles.extrasRow}>
              <div className={styles.extra}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitle}>Signature</div>
                  {!showSignature ? (
                    <button className={styles.btnLink} type="button" onClick={() => setShowSignature(true)}>
                      + Add signature
                    </button>
                  ) : (
                    <button className={styles.btnLink} type="button" onClick={() => setShowSignature(false)}>
                      Hide
                    </button>
                  )}
                </div>
                {showSignature && (
                  <div className={styles.signatureBox}>Sign here</div>
                )}
              </div>

              <div className={styles.extra}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitle}>Photos</div>
                  {!showPhotos ? (
                    <button className={styles.btnLink} type="button" onClick={() => setShowPhotos(true)}>
                      + Add photos
                    </button>
                  ) : (
                    <button className={styles.btnLink} type="button" onClick={() => setShowPhotos(false)}>
                      Hide
                    </button>
                  )}
                </div>
                {showPhotos && (
                  <div className={styles.photoBox}>
                    <button className={styles.btnSmall} type="button">Add Photo</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.totals}>
            <div className={styles.totalsRow}>
              <span className={styles.totalsLabel}>Subtotal</span>
              <span className={styles.totalsValue}>{formatMoney(subtotal, currencyCode)}</span>
            </div>
            <div className={styles.totalsRow}>
              <span className={styles.totalsLabel}>{taxLabel} ({Math.round(taxRate * 100)}%)</span>
              <span className={styles.totalsValue}>{formatMoney(taxAmount, currencyCode)}</span>
            </div>
            <div className={styles.totalsDivider} />
            <div className={styles.totalsRowBig}>
              <span className={styles.totalsLabelBig}>Total</span>
              <span className={styles.totalsValueBig}>{formatMoney(total, currencyCode)}</span>
            </div>

            <div className={styles.balanceDue}>
              <div className={styles.balanceLeft}>Balance Due</div>
              <div className={styles.balanceRight}>{formatMoney(total, currencyCode)}</div>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className={styles.footerActions}>
          <button className={styles.btnDanger} type="button">Delete invoice</button>
          <div className={styles.footerRight}>
            <button className={styles.btnSecondary} type="button">Close invoice</button>
            <button className={styles.btnPrimary} type="button" onClick={onSaveAndSend}>
              Save &amp; Send
            </button>
          </div>
        </div>
      </div>

      <div className={styles.pageSpacer} />
    </div>
  );
}
