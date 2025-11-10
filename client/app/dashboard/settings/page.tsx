'use client';

import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import styles from "./SettingsPage.module.css";

// Queries
const GET_INVOICE_SETTINGS = gql`
  query GetInvoiceSettings {
    invoiceSettings {
      id
      businessName
      abn
      address
      phone
      email
      website
      logoUrl
      bankDetails
      invoicePrefix
      startingNumber
      defaultDueDays
      gstRate
      smtpHost
      smtpPort
      smtpUser
      smtpPassword
      fromEmail
    }
  }
`;

// Mutations
const UPDATE_INVOICE_SETTINGS = gql`
  mutation UpdateInvoiceSettings($input: InvoiceSettingsInput!) {
    updateInvoiceSettings(input: $input) {
      id
      businessName
      abn
      address
      phone
      email
      website
      logoUrl
      bankDetails
      invoicePrefix
      startingNumber
      defaultDueDays
      gstRate
      smtpHost
      smtpPort
      smtpUser
      smtpPassword
      fromEmail
    }
  }
`;

export default function SettingsPage() {
  const { data, loading, error } = useQuery(GET_INVOICE_SETTINGS);

  const [updateSettings, { loading: saving }] = useMutation(
    UPDATE_INVOICE_SETTINGS,
    {
      refetchQueries: [{ query: GET_INVOICE_SETTINGS }],
      awaitRefetchQueries: true,
    }
  );

  const [form, setForm] = useState<any>({
    businessName: "",
    abn: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logoUrl: "",
    bankDetails: "",
    invoicePrefix: "INV-",
    startingNumber: "1",
    defaultDueDays: "14",
    gstRate: "10",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "", // reused as Business Owner Name
  });

  useEffect(() => {
    if (!data?.invoiceSettings) return;
    const s = data.invoiceSettings;

    setForm({
      businessName: s.businessName ?? "",
      abn: s.abn ?? "",
      address: s.address ?? "",
      phone: s.phone ?? "",
      email: s.email ?? "",
      website: s.website ?? "",
      logoUrl: s.logoUrl ?? "",
      bankDetails: s.bankDetails ?? "",
      invoicePrefix: s.invoicePrefix ?? "INV-",
      startingNumber: s.startingNumber?.toString() ?? "1",
      defaultDueDays: s.defaultDueDays?.toString() ?? "14",
      gstRate: s.gstRate != null ? String(s.gstRate * 100) : "10",
      smtpHost: s.smtpHost ?? "",
      smtpPort: s.smtpPort?.toString() ?? "",
      smtpUser: s.smtpUser ?? "",
      smtpPassword: s.smtpPassword ?? "",
      fromEmail: s.fromEmail ?? "",
      fromName: s.fromName ?? "", // reused
    });
  }, [data]);

  const set = (key: string) => (e: any) =>
    setForm((p: any) => ({ ...p, [key]: e.target.value }));

  // Logo uploader
  const MAX_FILE_SIZE_MB = 3;

  async function handleLogoUpload(file: File) {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      alert(`Max file size is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    const body = new FormData();
    body.append("file", file);

    const res = await fetch("/api/uploads/logo", {
      method: "POST",
      body,
    }).then((r) => r.json());

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    setForm((prev: any) => ({ ...prev, logoUrl: res.url }));
  }

  const onSave = async () => {
    try {
      await updateSettings({ variables: { input: {
        ...form,
        gstRate: Number(form.gstRate) / 100,
        startingNumber: Number(form.startingNumber),
        defaultDueDays: Number(form.defaultDueDays),
        smtpPort: Number(form.smtpPort),
      }} });

      alert("Settings saved ✅");
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

return (
  <div className={styles.wrapper}>
    <h1 className={styles.sectionTitle}>Business Details</h1>

    {/* LOGO UPLOAD CARD */}
    <div className={styles.logoCard}>
      <label className={styles.logoLabel}>Logo</label>

      <div className={styles.logoBox}>
        {form.logoUrl ? (
          <img src={form.logoUrl} className={styles.logoImage} />
        ) : (
          <div className={styles.logoPlaceholder}>+ Logo</div>
        )}

        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleLogoUpload(f);
          }}
        />
      </div>
    </div>

    {/* BUSINESS FIELDS */}
    <div className={styles.formCard}>
      <label className={styles.label}>Business Name</label>
      <input className={styles.input} value={form.businessName} onChange={set("businessName")} />

      <label className={styles.label}>Business Number</label>
      <input className={styles.input} value={form.abn} onChange={set("abn")} />

      <label className={styles.label}>Business Address</label>
      <input className={styles.input} placeholder="Street" value={form.address} onChange={set("address")} />

      <label className={styles.label}></label>
      <input className={styles.input} placeholder="City, State" />

      <label className={styles.label}></label>
      <input className={styles.input} placeholder="Postcode" />

      

      <label className={styles.label}>Email</label>
      <input className={styles.input} value={form.email} onChange={set("email")} />

      <label className={styles.label}>Phone</label>
      <input className={styles.input} value={form.phone} onChange={set("phone")} />

      <label className={styles.label}>Mobile</label>
      <input className={styles.input} />

      <label className={styles.label}>Website</label>
      <input className={styles.input} value={form.website} onChange={set("website")} />

      <label className={styles.helperText}>Your Business Address will appear on your documents</label>
    </div>

    {/* TEMPLATE PREVIEW */}
    <div className={styles.templateCard}>
      <label className={styles.label}>Invoice Template</label>
      <img src="/invoice-template-preview.png" className={styles.templatePreview} />
    </div>

    <button className={styles.saveButton} disabled={saving} onClick={onSave}>
      Customize Template
    </button>
  </div>
);
// Add closing curly brace for the function
}
