import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads folder exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Create unique filename
    const filename = `logo-${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // Write to disk
    await writeFile(filepath, buffer);

    // Create public URL for front-end + PDF
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (err) {
    console.error("Logo upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
