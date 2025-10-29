'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';

// ✅ Import shared, global invoice CSS (S2)
import '@/styles/invoice/base.css';
import '@/styles/invoice/h1.css';

// (Optional) tiny inline styles for the toolbar only
const toolbar: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '16px auto',
  maxWidth: 800,
};
const toolbarRight: React.CSSProperties = { display: 'flex', gap: 8 };

const GET_INVOICE_FOR_PREVIEW = gql`
  query GetInvoiceForPreview($invoiceId: ID!) {
    invoice(id: $invoiceId) {
      id
      invoiceNumber
      status
      issueDate
      dueDate
      subtotal
      gstRate
      gstAmount
      totalAmount
      notes

      # Snapshot fields (frozen company details)
      businessName
      abn
      address
      phone
      email
      website
      logoUrl
      bankDetails

      items {
        id
        description
        quantity
        unitPrice
        total
      }

      project {
        id
        title
        client {
          id
          name
          address
          email
          phone
        }
      }
    }
  }
`;

const fmtMoney = (v: number | null | undefined) =>
  (typeof v === 'number' ? v : 0).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });

const fmtDate = (d?: string | Date | null) => {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '';
  return dt.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function InvoicePreviewPage() {
  const router = useRouter();
  const params = useParams<{ invoiceId: string }>();
  const invoiceId = params?.invoiceId;

  const { data, loading, error } = useQuery(GET_INVOICE_FOR_PREVIEW, {
    variables: { invoiceId },
    skip: !invoiceId,
  });

  if (loading) return <div className="inv-page">Loading invoice…</div>;
  if (error) return <div className="inv-page">Failed to load: {error.message}</div>;
  const inv = data?.invoice;
  if (!inv) return <div className="inv-page">Invoice not found.</div>;

  const company = useMemo(
    () => ({
      name: (inv.businessName ?? '').trim() || 'Company Name',
      abn: (inv.abn ?? '').trim(),
      address: (inv.address ?? '').trim(),
      phone: (inv.phone ?? '').trim(),
      email: (inv.email ?? '').trim(),
      website: (inv.website ?? '').trim(),
      logoUrl: (inv.logoUrl ?? '').trim(),
      bankDetails: (inv.bankDetails ?? '').trim(),
    }),
    [inv]
  );

  const client = {
    name: inv.project?.client?.name ?? '',
    address: inv.project?.client?.address ?? '',
    email: inv.project?.client?.email ?? '',
    phone: inv.project?.client?.phone ?? '',
  };

  const contactBits = [company.phone, company.email, company.website].filter(Boolean).join(' · ');
  const amountPaid = 0; // add if/when payments are included
  const amountDue = (inv.totalAmount || 0) - amountPaid;

  const onBack = () => router.push('/dashboard/invoices');
  const onPrint = () => window.print();
  const onDownloadPdf = () =>
    window.open(`/api/invoices/${inv.id}/pdf?download=1`, '_blank', 'noopener,noreferrer');
  const onOpenPdf = () =>
    window.open(`/api/invoices/${inv.id}/pdf`, '_blank', 'noopener,noreferrer');

  return (
    <>
      {/* Minimal toolbar (not printed) */}
      <div style={toolbar} className="no-print">
        <button onClick={onBack}>Back to Invoices</button>
        <div style={toolbarRight}>
          <button onClick={onOpenPdf}>Open PDF</button>
          <button onClick={onDownloadPdf}>Download PDF</button>
          <button onClick={onPrint}>Print</button>
        </div>
      </div>

      {/* === IDENTICAL MARKUP TO PDF (H1) === */}
      <div className="inv-page inv-h1">
        <header className="inv-header">
          <div className="inv-brandRow">
            {company.logoUrl ? (
              <img src={company.logoUrl} className="inv-logo" alt={company.name} />
            ) : null}
            <div className="inv-companyBlock">
              <div className="inv-companyName">{company.name}</div>
              {company.abn ? <div className="inv-subtle">ABN {company.abn}</div> : null}
              {contactBits ? <div className="inv-subtle">{contactBits}</div> : null}
              {company.address ? <div className="inv-subtle">{company.address}</div> : null}
            </div>
          </div>

          <div className="inv-meta">
            <div className="inv-metaLabel">Invoice #</div>
            <div className="inv-metaValue">{inv.invoiceNumber ?? '—'}</div>

            <div className="inv-metaLabel">Issue Date</div>
            <div className="inv-metaValue">{fmtDate(inv.issueDate)}</div>

            <div className="inv-metaLabel">Due Date</div>
            <div className="inv-metaValue">{fmtDate(inv.dueDate)}</div>

            <div className="inv-metaLabel">Status</div>
            <div className="inv-metaValue">{inv.status ?? '—'}</div>
          </div>
        </header>

        <section className="inv-parties">
          <div>
            <div className="inv-sectionTitle">Bill To</div>
            <div className="inv-bold">{client.name || 'Client'}</div>
            {client.address ? <div className="inv-subtle">{client.address}</div> : null}
            {[client.email, client.phone].filter(Boolean).length ? (
              <div className="inv-subtle">
                {[client.email, client.phone].filter(Boolean).join(' · ')}
              </div>
            ) : null}
          </div>

          <div>
            <div className="inv-sectionTitle">Project</div>
            <div className="inv-bold">{inv.project?.title ?? '—'}</div>
          </div>
        </section>

        <section className="inv-items">
          <table className="inv-table">
            <thead>
              <tr>
                <th className="inv-colDesc">Description</th>
                <th className="inv-colQty">Qty</th>
                <th className="inv-colMoney">Unit</th>
                <th className="inv-colMoney">Total</th>
              </tr>
            </thead>
            <tbody>
              {(inv.items ?? []).length > 0 ? (
                inv.items.map((it: any) => (
                  <tr key={it.id}>
                    <td className="inv-colDesc">{it.description}</td>
                    <td className="inv-colQty">{it.quantity ?? 1}</td>
                    <td className="inv-colMoney">{fmtMoney(it.unitPrice)}</td>
                    <td className="inv-colMoney">{fmtMoney(it.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="inv-emptyRow" colSpan={4}>
                    No items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="inv-totals">
          <div className="inv-totalsBox">
            <div className="inv-row">
              <div>Subtotal</div>
              <div>{fmtMoney(inv.subtotal)}</div>
            </div>
            <div className="inv-row">
              <div>GST {(inv.gstRate ?? 0.1) * 100}%</div>
              <div>{fmtMoney(inv.gstAmount)}</div>
            </div>
            {amountPaid > 0 && (
              <div className="inv-row">
                <div>Amount Paid</div>
                <div>-{fmtMoney(amountPaid)}</div>
              </div>
            )}
            <div className="inv-row inv-totalRow">
              <div>Total</div>
              <div>{fmtMoney(amountDue)}</div>
            </div>
          </div>
        </section>

        {inv.notes ? (
          <section className="inv-notes">
            <div className="inv-sectionTitle">Notes</div>
            <div className="inv-noteBody">{inv.notes}</div>
          </section>
        ) : null}

        <footer className="inv-footer">
          {company.bankDetails ? (
            <>
              <div className="inv-sectionTitle">Bank Details</div>
              <div>{company.bankDetails}</div>
            </>
          ) : (
            <div className="inv-thanks">Thank you for your business.</div>
          )}
        </footer>
      </div>
    </>
  );
}
