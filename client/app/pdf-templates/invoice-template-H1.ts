// client/app/pdf-templates/invoice-template-H1.ts
// Pure HTML generator for the H1 invoice (inline CSS -> PDF-safe)

type MoneyLike = number | null | undefined;
const fmtMoney = (v: MoneyLike) =>
  (typeof v === "number" ? v : 0).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });

const fmtDate = (d?: string | Date | null) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" });
};

export type InvoiceForRender = {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string | Date;
  dueDate: string | Date;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  notes?: string | null;

  // company snapshot on invoice
  businessName?: string | null;
  abn?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  bankDetails?: string | null;

  items: Array<{ id: string; description: string; quantity: number | null; unitPrice: number; total: number }>;
  project?: { title?: string | null; client?: { name?: string | null; address?: string | null; email?: string | null; phone?: string | null } | null } | null;
};

export function renderInvoiceH1HTML(inv: InvoiceForRender) {
  const company = {
    name: (inv.businessName ?? "").trim() || "Company Name",
    abn: (inv.abn ?? "").trim(),
    address: (inv.address ?? "").trim(),
    phone: (inv.phone ?? "").trim(),
    email: (inv.email ?? "").trim(),
    website: (inv.website ?? "").trim(),
    logoUrl: (inv.logoUrl ?? "").trim(),
    bankDetails: (inv.bankDetails ?? "").trim(),
  };

  const client = {
    name: inv.project?.client?.name ?? "",
    address: inv.project?.client?.address ?? "",
    email: inv.project?.client?.email ?? "",
    phone: inv.project?.client?.phone ?? "",
  };

  const contactBits = [company.phone, company.email, company.website].filter(Boolean).join(" · ");

  // Inline CSS (PDF-safe)
  const styles = `
    :root {
      --brand:#2a27f5; --accent:#9127F5; --text:#111827; --muted:#6b7280; --line:#e5e7eb; --paper:#ffffff;
    }
    *{box-sizing:border-box;}
    body{margin:0;padding:0;font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:var(--text);background:var(--paper);}
    .page{width:800px; margin:0 auto; padding:32px 32px 48px;}
    .header{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line);padding-bottom:16px;margin-bottom:20px;}
    .brandRow{display:flex;gap:16px;align-items:flex-start;max-width:60%;}
    .logo{height:54px;width:auto;object-fit:contain;}
    .companyBlock{}
    .companyName{font-size:20px;font-weight:700;line-height:1.1;}
    .subtle{font-size:12px;color:var(--muted);margin-top:2px;}
    .meta{display:grid;grid-template-columns:auto auto;gap:8px 16px;align-content:flex-start;}
    .metaLabel{font-size:11px;color:var(--muted);}
    .metaValue{font-size:13px;font-weight:600;}

    .parties{display:flex;justify-content:space-between;gap:24px;margin:8px 0 10px 0;padding-bottom:6px;border-bottom:1px dashed var(--line);}
    .sectionTitle{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;}
    .bold{font-weight:600;}

    .items{margin-top:6px;}
    table{width:100%;border-collapse:collapse;}
    thead th{font-size:12px;color:var(--muted);text-align:left;border-bottom:1px solid var(--line);padding:10px 0 8px;}
    tbody td{font-size:13px;padding:9px 0;border-bottom:1px solid var(--line);}
    .colDesc{width:55%;}
    .colQty{width:10%;text-align:right;}
    .colMoney{width:17.5%;text-align:right;}

    .totals{display:flex;justify-content:flex-end;margin-top:10px;}
    .totalsBox{width:320px;border:1px solid var(--line);border-radius:10px;padding:12px;}
    .row{display:flex;justify-content:space-between;font-size:13px;margin:4px 0;}
    .totalRow{font-size:15px;font-weight:700;border-top:1px dashed var(--line);padding-top:8px;margin-top:8px;}

    .notes{margin-top:12px;}
    .noteBody{font-size:13px;white-space:pre-wrap;}
    .footer{margin-top:14px;border-top:1px solid var(--line);padding-top:10px;font-size:12px;color:var(--muted);}
    .thanks{margin-top:8px;font-size:12px;color:var(--muted);}

    @page { size: A4; margin: 16mm 14mm; }
    @media print {
      body { background: white; }
      .page { width:auto; margin:0; padding:0; }
    }
  `;

  const itemsRows = (inv.items ?? []).map(it => `
    <tr>
      <td class="colDesc">${it.description ?? ""}</td>
      <td class="colQty">${(it.quantity ?? 1)}</td>
      <td class="colMoney">${fmtMoney(it.unitPrice)}</td>
      <td class="colMoney">${fmtMoney(it.total)}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${inv.invoiceNumber}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>${styles}</style>
</head>
<body>
  <div class="page">

    <header class="header">
      <div class="brandRow">
        ${company.logoUrl ? `<img src="${company.logoUrl}" class="logo" alt="${company.name}" />` : ""}
        <div class="companyBlock">
          <div class="companyName">${company.name}</div>
          ${company.abn ? `<div class="subtle">ABN ${company.abn}</div>` : ""}
          ${contactBits ? `<div class="subtle">${contactBits}</div>` : ""}
          ${company.address ? `<div class="subtle">${company.address}</div>` : ""}
        </div>
      </div>
      <div class="meta">
        <div class="metaLabel">Invoice #</div><div class="metaValue">${inv.invoiceNumber ?? "—"}</div>
        <div class="metaLabel">Issue Date</div><div class="metaValue">${fmtDate(inv.issueDate)}</div>
        <div class="metaLabel">Due Date</div><div class="metaValue">${fmtDate(inv.dueDate)}</div>
        <div class="metaLabel">Status</div><div class="metaValue">${inv.status ?? "—"}</div>
      </div>
    </header>

    <section class="parties">
      <div>
        <div class="sectionTitle">Bill To</div>
        <div class="bold">${client.name || "Client"}</div>
        ${client.address ? `<div class="subtle">${client.address}</div>` : ""}
        ${[client.email, client.phone].filter(Boolean).length ? `<div class="subtle">${[client.email, client.phone].filter(Boolean).join(" · ")}</div>` : ""}
      </div>
      <div>
        <div class="sectionTitle">Project</div>
        <div class="bold">${inv.project?.title ?? "—"}</div>
      </div>
    </section>

    <section class="items">
      <table>
        <thead>
          <tr>
            <th class="colDesc">Description</th>
            <th class="colQty">Qty</th>
            <th class="colMoney">Unit</th>
            <th class="colMoney">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows || `<tr><td colspan="4" class="subtle" style="padding:12px 0;">No items</td></tr>`}
        </tbody>
      </table>
    </section>

    <section class="totals">
      <div class="totalsBox">
        <div class="row"><div>Subtotal</div><div>${fmtMoney(inv.subtotal)}</div></div>
        <div class="row"><div>GST ${(inv.gstRate ?? 0.1) * 100}%</div><div>${fmtMoney(inv.gstAmount)}</div></div>
        <div class="row totalRow"><div>Total</div><div>${fmtMoney(inv.totalAmount)}</div></div>
      </div>
    </section>

    ${inv.notes ? `
      <section class="notes">
        <div class="sectionTitle">Notes</div>
        <div class="noteBody">${(inv.notes ?? "").replace(/</g,"&lt;")}</div>
      </section>
    ` : ""}

    <footer class="footer">
      ${company.bankDetails
        ? `<div class="sectionTitle">Bank Details</div><div>${company.bankDetails}</div>`
        : `<div class="thanks">Thank you for your business.</div>`}
    </footer>

  </div>
</body>
</html>
  `;
}
