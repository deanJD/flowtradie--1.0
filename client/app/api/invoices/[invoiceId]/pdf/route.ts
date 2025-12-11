export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import puppeteer from "puppeteer";
import { renderInvoiceH1HTML } from "@/app/pdf-templates/invoice-template-H1";

/* ----------------------------------------------------------------
   1. GraphQL Query (UPDATED to fetch Snapshots)
   ---------------------------------------------------------------- */
const GRAPHQL_URL = process.env.NEXT_PUBLIC_SERVER_URL 
  ? `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql` 
  : "http://localhost:4000/graphql";

async function fetchInvoice(invoiceId: string, cookieHeader?: string) {
  const query = `
    query GetInvoiceForPDF($invoiceId: ID!) {
      invoice(id: $invoiceId) {
        id 
        invoiceNumber 
        status 
        issueDate 
        dueDate 
        subtotal 
        taxRate 
        gstAmount: taxAmount 
        totalAmount 
        notes
        
        # ✅ Fetch the JSON Snapshots
        businessSnapshot 
        clientSnapshot
        
        items { id description quantity unitPrice total }
        project { title }
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

function buildFileName(inv: any) {
  const clientName = inv.clientSnapshot?.businessName || inv.clientSnapshot?.firstName || "Client";
  const number = inv.invoiceNumber || "DRAFT";
  return `${clientName} - Invoice ${number}.pdf`.replace(/[\/\\:*?"<>|]+/g, "-");
}

/* ----------------------------------------------------------------
   2. Main Handler
   ---------------------------------------------------------------- */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await ctx.params;
    const url = new URL(req.url);
    const forceDownload = url.searchParams.get("download") === "1";
    const hdrs = await headers();

    // 1. Fetch Data
    const rawInvoice = await fetchInvoice(invoiceId, hdrs.get("cookie") ?? undefined);
    if (!rawInvoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 2. Unpack Snapshots (The "Adapter" Step)
    // We map the JSON back to flat fields so the Template doesn't need changing
    const invoiceForRender = {
      ...rawInvoice,
      // Flatten Business Snapshot
      businessName: rawInvoice.businessSnapshot?.businessName,
      abn: rawInvoice.businessSnapshot?.abn,
      address: rawInvoice.businessSnapshot?.address 
        ? `${rawInvoice.businessSnapshot.address.line1}, ${rawInvoice.businessSnapshot.address.city}` // Simple format
        : "",
      phone: rawInvoice.businessSnapshot?.phone,
      email: rawInvoice.businessSnapshot?.email,
      website: rawInvoice.businessSnapshot?.website,
      logoUrl: rawInvoice.businessSnapshot?.logoUrl,
      bankDetails: rawInvoice.businessSnapshot?.bankDetails,

      // Flatten Client Snapshot
      project: {
        title: rawInvoice.project?.title,
        client: {
          name: rawInvoice.clientSnapshot?.businessName || `${rawInvoice.clientSnapshot?.firstName} ${rawInvoice.clientSnapshot?.lastName}`,
          email: rawInvoice.clientSnapshot?.email,
          phone: rawInvoice.clientSnapshot?.phone,
          address: rawInvoice.clientSnapshot?.address?.line1 || "",
        }
      }
    };

    // 3. Generate HTML
    const html = renderInvoiceH1HTML(invoiceForRender);

    // 4. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" }, // CSS handles margins
    });
    await browser.close();

    // 5. Return File
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${forceDownload ? "attachment" : "inline"}; filename="${buildFileName(rawInvoice)}"`,
        "Cache-Control": "no-store",
      },
    });

  } catch (err: any) {
    console.error("PDF generation failed:", err);
    return NextResponse.json({ error: "Could not generate PDF" }, { status: 500 });
  }
}