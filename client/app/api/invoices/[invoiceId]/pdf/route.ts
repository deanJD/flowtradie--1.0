import { NextResponse } from "next/server";
import puppeteer, { type Browser } from "puppeteer";
import { cookies, headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteCtx = { params: { invoiceId: string } };

export async function GET(_req: Request, { params }: RouteCtx) {
  const { invoiceId } = params;

  // ✅ AWAIT headers() — it's async
  const hdrs = await headers();
  const forwardedProto = hdrs.get("x-forwarded-proto") ?? "http";
  const host = hdrs.get("host") ?? "localhost:3000";
  const base = process.env.NEXT_PUBLIC_BASE_URL || `${forwardedProto}://${host}`;

  // ✅ Add ?pdf=1 query flag
  const previewUrl = `${base}/dashboard/invoices/${invoiceId}?pdf=1`;

  // ✅ AWAIT cookies() — also async
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c: any) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    if (cookieHeader) {
      await page.setExtraHTTPHeaders({ Cookie: cookieHeader });
    }

    await page.emulateMediaType("print");

    await page.goto(previewUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "12mm", bottom: "16mm", left: "12mm" },
    });

    const filename = `Invoice-${invoiceId}.pdf`;

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });

  } catch (err: any) {
    console.error("PDF error:", err);
    return NextResponse.json(
      { error: "PDF generation failed", detail: err?.message },
      { status: 500 }
    );
  } finally {
    try {
      await browser?.close();
    } catch {}
  }
}
