"use client";

import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import styles from "./InvoicePreview.module.css";
import Button from "@/components/Button/Button";

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
        }
      }
    }
  }
`;

type MoneyLike = number | null | undefined;
const fmtMoney = (v: MoneyLike) =>
  (typeof v === "number" ? v : 0).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });

const fmtDate = (d?: string | null) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function InvoicePreviewPage() {
  const router = useRouter();
  const params = useParams<{ invoiceId: string }>();
  const search = useSearchParams();
  const isPdfMode = search.get("pdf") === "1";
  const invoiceId = params?.invoiceId;

  const { data, loading, error } = useQuery(GET_INVOICE_FOR_PREVIEW, {
    variables: { invoiceId },
    skip: !invoiceId,
  });

  const inv = data?.invoice;

  const company = useMemo(
    () => ({
      businessName: inv?.businessName?.trim() || "",
      abn: inv?.abn?.trim() || "",
      address: inv?.address?.trim() || "",
      phone: inv?.phone?.trim() || "",
      email: inv?.email?.trim() || "",
      website: inv?.website?.trim() || "",
      logoUrl: inv?.logoUrl?.trim() || "",
      bankDetails: inv?.bankDetails?.trim() || "",
    }),
    [inv]
  );

  const contactLine = useMemo(() => {
    const bits = [company.phone, company.email, company.website].filter(Boolean);
    return bits.join(" · ");
  }, [company.phone, company.email, company.website]);

  const onBack = () => router.push("/dashboard/invoices");
  const onPrint = () => window.print();
  const onDownloadPdf = () => {
    if (!invoiceId) return;
    window.open(`/api/invoices/${invoiceId}/pdf`, "_blank", "noopener,noreferrer");
  };
  const onSendInvoice = () => {
    alert("Send Invoice: coming soon.");
  };

  if (loading) return <div className={styles.overlay}>Loading invoice…</div>;
  if (error) return <div className={styles.overlayError}>Failed to load invoice: {error.message}</div>;
  if (!inv) return <div className={styles.overlayError}>Invoice not found.</div>;

  return (
    <div className={`${styles.wrapper} ${isPdfMode ? styles.pdfWrapper : ""}`}>
      
      {/* ✅ Toolbar only when NOT in PDF mode */}
      {!isPdfMode && (
        <div className={styles.toolbar}>
          <Button variant="secondary" onClick={onBack}>Back to Invoices</Button>
          <div className={styles.spacer} />
          <Button variant="secondary" onClick={onSendInvoice}>Send Invoice</Button>
          <Button variant="secondary" onClick={onDownloadPdf}>Download PDF</Button>
          <Button onClick={onPrint}>Print</Button>
        </div>
      )}

      <div className={`${styles.paper} ${isPdfMode ? styles.pdfPaper : ""}`}>

        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.brandRow}>
            {company.logoUrl && (
              <img src={company.logoUrl} alt={company.businessName} className={styles.logo} />
            )}
            <div className={styles.companyBlock}>
              <div className={styles.companyName}>{company.businessName || "Company Name"}</div>
              {company.abn && <div className={styles.subtle}>ABN {company.abn}</div>}
              {contactLine && <div className={styles.subtle}>{contactLine}</div>}
              {company.address && <div className={styles.subtle}>{company.address}</div>}
            </div>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaRow}><div className={styles.metaLabel}>Invoice #</div><div className={styles.metaValue}>{inv.invoiceNumber}</div></div>
            <div className={styles.metaRow}><div className={styles.metaLabel}>Issue Date</div><div className={styles.metaValue}>{fmtDate(inv.issueDate)}</div></div>
            <div className={styles.metaRow}><div className={styles.metaLabel}>Due Date</div><div className={styles.metaValue}>{fmtDate(inv.dueDate)}</div></div>
            <div className={styles.metaRow}><div className={styles.metaLabel}>Status</div><div className={styles.metaValue}>{inv.status}</div></div>
          </div>
        </header>

        {/* BILL TO / PROJECT */}
        <section className={styles.parties}>
          <div>
            <div className={styles.sectionTitle}>Bill To</div>
            <div className={styles.bold}>{inv.project?.client?.name || "Client"}</div>
          </div>
          <div className={styles.toRight}>
            <div className={styles.sectionTitle}>Project</div>
            <div className={styles.bold}>{inv.project?.title || "—"}</div>
          </div>
        </section>

        {/* ITEMS */}
        <section className={styles.items}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colDesc}>Description</th>
                <th className={styles.colQty}>Qty</th>
                <th className={styles.colMoney}>Unit</th>
                <th className={styles.colMoney}>Total</th>
              </tr>
            </thead>
            <tbody>
              {inv.items?.map((it: any) => (
                <tr key={it.id}>
                  <td className={styles.colDesc}>{it.description}</td>
                  <td className={styles.colQty}>{it.quantity}</td>
                  <td className={styles.colMoney}>{fmtMoney(it.unitPrice)}</td>
                  <td className={styles.colMoney}>{fmtMoney(it.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* TOTALS */}
        <section className={styles.totals}>
          <div className={styles.totalRow}><div className={styles.totalLabel}>Subtotal</div><div className={styles.totalValue}>{fmtMoney(inv.subtotal)}</div></div>
          <div className={styles.totalRow}><div className={styles.totalLabel}>GST {(inv.gstRate ?? 0.1) * 100}%</div><div className={styles.totalValue}>{fmtMoney(inv.gstAmount)}</div></div>
          <div className={styles.totalRowBig}><div className={styles.totalLabelBig}>Total</div><div className={styles.totalValueBig}>{fmtMoney(inv.totalAmount)}</div></div>
        </section>

        {/* NOTES */}
        {inv.notes && (
          <section className={styles.notes}>
            <div className={styles.sectionTitle}>Notes</div>
            <div className={styles.noteBody}>{inv.notes}</div>
          </section>
        )}

        {/* FOOTER */}
        <footer className={styles.footer}>
          {company.bankDetails ? (
            <>
              <div className={styles.sectionTitle}>Bank Details</div>
              <div className={styles.subtle}>{company.bankDetails}</div>
            </>
          ) : (
            <div className={styles.subtle}>Thank you for your business.</div>
          )}
        </footer>
      </div>
    </div>
  );
}
