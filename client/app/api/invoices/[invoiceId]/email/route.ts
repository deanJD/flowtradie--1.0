import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ invoiceId: string }> } // ✅ Next.js 15 correct signature
) {
  const { invoiceId } = await ctx.params;        // ✅ Must await now

  const body = await req.json();
  const email = body?.email || "test@example.com";

  // ✅ Local test account in development
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"FlowTradie Invoice" <no-reply@flowtradie.local>`,
    to: email,
    subject: `Invoice ${invoiceId}`,
    text: `Your invoice ${invoiceId} is ready.`,
    html: `<p>Your invoice <b>${invoiceId}</b> is ready.</p>`,
  });

  return NextResponse.json({
    ok: true,
    previewUrl: nodemailer.getTestMessageUrl(info), // ✅ Works in dev
  });
}
