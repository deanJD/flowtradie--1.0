import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const { to, subject, message } = await req.json();

  // Fetch the PDF from our existing PDF endpoint
  const pdfRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/invoices/${invoiceId}/pdf`);
  const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

  // Configure mailer (placeholder)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"FlowTradie" <no-reply@flowtradie.com>',
    to,
    subject: subject || `Invoice ${invoiceId}`,
    text: message || 'Please find attached your invoice.',
    attachments: [{ filename: `Invoice-${invoiceId}.pdf`, content: pdfBuffer }],
  });

  return NextResponse.json({ success: true });
}
