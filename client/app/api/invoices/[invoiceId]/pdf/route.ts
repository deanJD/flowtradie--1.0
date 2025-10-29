export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";

/** Build file name using FN3: "<Client Name> - <InvoiceNumber>.pdf" */
function buildFileName(inv: any) {
  const clientName: string =
    inv?.project?.client?.name?.toString().trim() || "Invoice";
  const number: string = inv?.invoiceNumber?.toString().trim() || inv?.id || "";
  return `${clientName} - ${number}.pdf`.replace(/[\/\\:*?"<>|]+/g, "-");
}

/** Shared HTML renderer — matches H1 classes and base/h1 CSS */
function renderInvoiceHTML(inv: any, cssBase: string, cssH1: string) {
  const styles = `${cssBase}\n\n${cssH1}`;

  const fmtMoney = (v: any) =>
    (typeof v === "number" ? v : 0).toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
    });

  const fmtDate = (d?: string | Date | null) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  const contactBits = [company.phone, company.email, company.website]
    .filter(Boolean)
    .join(" · ");

  const itemsRows = (inv.items ?? [])
    .map(
      (it: any) => `
      <tr>
        <td class="inv-colDesc">${it.description ?? ""}</td>
        <td class="inv-colQty">${it.quantity ?? 1}</td>
        <td class="inv-colMoney">${fmtMoney(it.unitPrice)}</td>
        <td class="inv-colMoney">${fmtMoney(it.total)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${buildFileName(inv)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>${styles}</style>
</head>
<body>
  <div class="inv-page inv-h1">
    <header class="inv-header">
      <div class="inv-brandRow">
        ${company.logoUrl ? `<img src="${company.logoUrl}" class="inv-logo" alt="${company.name}" />` : ""}
        <div class="inv-companyBlock">
          <div class="inv-companyName">${company.name}</div>
          ${company.abn ? `<div class="inv-subtle">ABN ${company.abn}</div>` : ""}
          ${contactBits ? `<div class="inv-subtle">${contactBits}</div>` : ""}
          ${company.address ? `<div class="inv-subtle">${company.address}</div>` : ""}
        </div>
      </div>
      <div class="inv-meta">
        <div>Invoice #</div><div>${inv.invoiceNumber ?? "—"}</div>
        <div>Issue Date</div><div>${fmtDate(inv.issueDate)}</div>
        <div>Due Date</div><div>${fmtDate(inv.dueDate)}</div>
        <div>Status</div><div>${inv.status ?? "—"}</div>
      </div>
    </header>

    <section class="inv-parties">
      <div>
        <div class="inv-sectionTitle">Bill To</div>
        <div class="inv-bold">${client.name || "Client"}</div>
        ${client.address ? `<div class="inv-subtle">${client.address}</div>` : ""}
        ${
          [client.email, client.phone].filter(Boolean).length
            ? `<div class="inv-subtle">${[client.email, client.phone].filter(Boolean).join(" · ")}</div>`
            : ""
        }
      </div>
      <div>
        <div class="inv-sectionTitle">Project</div>
        <div class="inv-bold">${inv.project?.title ?? "—"}</div>
      </div>
    </section>

    <section class="inv-items">
      <table class="inv-table">
        <thead>
          <tr>
            <th class="inv-colDesc">Description</th>
            <th class="inv-colQty">Qty</th>
            <th class="inv-colMoney">Unit</th>
            <th class="inv-colMoney">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows || `<tr><td class="inv-emptyRow" colspan="4">No items</td></tr>`}
        </tbody>
      </table>
    </section>

    <section class="inv-totals">
      <div class="inv-totalsBox">
        <div class="inv-row"><div>Subtotal</div><div>${fmtMoney(inv.subtotal)}</div></div>
        <div class="inv-row"><div>GST ${(inv.gstRate ?? 0.1) * 100}%</div><div>${fmtMoney(inv.gstAmount)}</div></div>
        <div class="inv-row inv-totalRow"><div>Total</div><div>${fmtMoney(inv.totalAmount)}</div></div>
      </div>
    </section>

    ${
      inv.notes
        ? `<section class="inv-notes">
            <div class="inv-sectionTitle">Notes</div>
            <div class="inv-noteBody">${String(inv.notes).replace(/</g,"&lt;")}</div>
          </section>`
        : ""
    }

    <footer class="inv-footer">
      ${
        company.bankDetails
          ? `<div><div class="inv-sectionTitle">Bank Details</div><div>${company.bankDetails}</div></div>`
          : `<div class="inv-thanks">Thank you for your business.</div>`
      }
    </footer>
  </div>
</body>
</html>`;
}

const GRAPHQL_URL =
  (process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql`
    : "http://localhost:4000/graphql");

async function fetchInvoice(invoiceId: string, cookieHeader?: string) {
  const query = `
    query GetInvoiceForPDF($invoiceId: ID!) {
      invoice(id: $invoiceId) {
        id invoiceNumber status issueDate dueDate subtotal gstRate gstAmount totalAmount notes
        businessName abn address phone email website logoUrl bankDetails
        items { id description quantity unitPrice total }
        project { title client { name address email phone } }
      }
    }
  `;
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({ query, variables: { invoiceId } }),
  });

  if (!res.ok) throw new Error(`GraphQL error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "GraphQL failed");
  return json.data.invoice;
}

function buildHeaders(fileName: string, forceDownload: boolean) {
  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `${forceDownload ? "attachment" : "inline"}; filename="${fileName}"`,
    "Cache-Control": "no-store",
  };
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ invoiceId: string }> } // Next 15: params is a Promise
) {
  try {
    const { invoiceId } = await ctx.params;

    const url = new URL(req.url);
    const forceDownload = url.searchParams.get("download") === "1";

    // Forward cookies to GraphQL for auth
    const hdrs = await headers();
    const cookieHeader = hdrs.get("cookie") ?? undefined;

    // 1) Load data
    const invoice = await fetchInvoice(invoiceId, cookieHeader);
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 2) Load CSS from confirmed paths (A)
    const cssBase = fs.readFileSync(path.join(process.cwd(), "styles/invoice/base.css"), "utf8");
    const cssH1   = fs.readFileSync(path.join(process.cwd(), "styles/invoice/h1.css"), "utf8");

    // 3) HTML
    const html = renderInvoiceHTML(invoice, cssBase, cssH1);

    // 4) Puppeteer → PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", right: "14mm", bottom: "16mm", left: "14mm" },
      preferCSSPageSize: true,
    });
    await browser.close();

    const fileName = buildFileName(invoice);
    return new Response(Buffer.from(pdfBuffer), { headers: buildHeaders(fileName, forceDownload) });
  } catch (err: any) {
    console.error("PDF route error:", err);
    return NextResponse.json({ error: err?.message ?? "PDF failed" }, { status: 500 });
  }
}
