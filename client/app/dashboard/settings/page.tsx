
'use client';

import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import styles from "./SettingsPage.module.css";


// ✅ Updated schema: new structured fields
const GET_INVOICE_SETTINGS = gql`
  query GetInvoiceSettings {
    invoiceSettings {
      id
      businessName
      abn
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

      # NEW structured address
      addressLine1
      addressLine2
      city
      state
      postcode
      country
    }
  }
`;

const UPDATE_INVOICE_SETTINGS = gql`
  mutation UpdateInvoiceSettings($input: InvoiceSettingsInput!) {
    updateInvoiceSettings(input: $input) {
      id
      businessName
      abn
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

      # NEW structured address
      addressLine1
      addressLine2
      city
      state
      postcode
      country
    }
  }
`;

export default function SettingsPage() {
  const { data, loading, error } = useQuery(GET_INVOICE_SETTINGS);
  const [updateSettings, { loading: saving }] = useMutation(UPDATE_INVOICE_SETTINGS, {
    refetchQueries: [{ query: GET_INVOICE_SETTINGS }],
    awaitRefetchQueries: true,
  });

  // ✅ Handle logo upload// ✅ Image resize helper
function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Resize failed");

          const resizedFile = new File([blob], file.name, {
            type: blob.type,
            lastModified: Date.now(),
          });

          resolve(resizedFile);
        },
        "image/jpeg", // output type
        quality
      );
    };

    reader.readAsDataURL(file);
  });
}

// ✅ Main upload handler with validation + auto-resize
async function handleLogoUpload(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG, PNG, or WebP allowed.");
    return;
  }

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  let finalFile = file;

  if (file.size > MAX_SIZE) {
    finalFile = await resizeImage(file, 800, 800, 0.8);
  }

  const formData = new FormData();
  formData.append("file", finalFile);

  const res = await fetch("/api/upload-logo", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.url) {
    setForm((prev: any) => ({ ...prev, logoUrl: data.url }));
  } else {
    alert("Upload failed");
  }
}


  // ✅ include new structured fields
  const [form, setForm] = useState<any>({
    businessName: "",
    abn: "",
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
    fromName: "",     // ✅ add this

    // ✅ new structured fields
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
  });

  useEffect(() => {
  if (!data?.invoiceSettings) return;
  const s = data.invoiceSettings;

  setForm({
    businessName: s.businessName ?? "",
    abn: s.abn ?? "",

    addressLine1: s.addressLine1 ?? "",
    addressLine2: s.addressLine2 ?? "",
    city: s.city ?? "",
    state: s.state ?? "",
    postcode: s.postcode ?? "",
    country: s.country ?? "",

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
    fromName: s.fromName ?? "",
  });
}, [data]);


  const set = (key: string) => (e: any) =>
    setForm((prev: any) => ({ ...prev, [key]: e.target.value }));

  // ✅ Save
const onSave = async () => {
  try {
    await updateSettings({
      variables: {
        input: {
          businessName: form.businessName,
          abn: form.abn,

          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
          country: form.country,

          phone: form.phone,
          email: form.email,
          website: form.website,
          logoUrl: form.logoUrl,
          bankDetails: form.bankDetails,

          invoicePrefix: form.invoicePrefix,
          startingNumber: Number(form.startingNumber),
          defaultDueDays: Number(form.defaultDueDays),
          gstRate: Number(form.gstRate) / 100,

          smtpHost: form.smtpHost,
          smtpPort: Number(form.smtpPort),
          smtpUser: form.smtpUser,
          smtpPassword: form.smtpPassword,
          fromEmail: form.fromEmail,
          fromName: form.fromName,
        }
      }
    });

    alert("Settings saved ✅");
  } catch (err) {
    alert("Failed to save settings");
  }
};


  
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.sectionTitle}>Business Details</h1>

      {/* ✅ LOGO UPLOAD CARD */}
<div className={styles.logoCard}>

  <label className={styles.logoLabel}>Logo</label>

  <div
    className={styles.logoDropArea}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleLogoUpload(file);
    }}
  >

    {/* ✅ If logo exists → show preview */}
    {form.logoUrl ? (
      <img src={form.logoUrl} className={styles.logoImage} />
    ) : (
      <div className={styles.logoPlaceholder}>
        Drag & Drop or Click to Upload
      </div>
    )}

    {/* ✅ Hidden upload input – triggered by button */}
    <input
      type="file"
      accept="image/*"
      className={styles.fileInput}
      id="logoFileInput"
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) handleLogoUpload(f);
      }}
    />
  </div>

  {/* ✅ Buttons */}
  <div className={styles.logoButtons}>
    <button
      type="button"
      className={styles.uploadButton}
      onClick={() => document.getElementById("logoFileInput")?.click()}
    >
      Upload Logo
    </button>

    {form.logoUrl && (
      <button
        type="button"
        className={styles.deleteButton}
        onClick={() =>
          setForm((p: any) => ({ ...p, logoUrl: "" }))
        }
      >
        Delete Logo
      </button>
    )}
  </div>
</div>

      {/* ✅ BUSINESS FIELDS */}
      <div className={styles.formCard}>
        <label className={styles.label}>Business Name</label>
        <input className={styles.input} value={form.businessName} onChange={set("businessName")} />

        <label className={styles.label}>Business Number</label>
        <input className={styles.input} value={form.abn} onChange={set("abn")} />

        {/* ✅ STRUCTURED ADDRESS BLOCK */}
        <label className={styles.label}>Business Address</label>
        <input
          className={styles.input}
          placeholder="Street address"
          value={form.addressLine1}
          onChange={set("addressLine1")}
        />

        <label className={styles.label}></label>
        <input
          className={styles.input}
          placeholder="Apartment, suite (optional)"
          value={form.addressLine2}
          onChange={set("addressLine2")}
        />

        <label className={styles.label}></label>
        <input
          className={styles.input}
          placeholder="City"
          value={form.city}
          onChange={set("city")}
        />

        <label className={styles.label}></label>
        <input
          className={styles.input}
          placeholder="State"
          value={form.state}
          onChange={set("state")}
        />

        <label className={styles.label}></label>
        <input
          className={styles.input}
          placeholder="Postcode"
          value={form.postcode}
          onChange={set("postcode")}
        />

        <label className={styles.label}></label>
        <input
          className={styles.input}
          placeholder="Country"
          value={form.country}
          onChange={set("country")}
        />

        {/* CONTACT */}
        <label className={styles.label}>Email</label>
        <input className={styles.input} value={form.email} onChange={set("email")} />

        <label className={styles.label}>Phone</label>
        <input className={styles.input} value={form.phone} onChange={set("phone")} />

        <label className={styles.label}>Website</label>
        <input className={styles.input} value={form.website} onChange={set("website")} />

        <label className={styles.helperText}>Your address appears on invoices & quotes.</label>
      </div>
      {/* ✅ INVOICE SETTINGS */}
<h1 className={styles.sectionTitle}>Invoice Settings</h1>

<div className={styles.formCard}>
  <label className={styles.label}>Bank Details</label>
  <input
    className={styles.input}
    value={form.bankDetails}
    onChange={set("bankDetails")}
    placeholder="Bank name, BSB, Account number"
  />

  <label className={styles.label}>Invoice Prefix</label>
  <input
    className={styles.input}
    value={form.invoicePrefix}
    onChange={set("invoicePrefix")}
    placeholder="INV-"
  />

  <label className={styles.label}>Starting Invoice Number</label>
  <input
    className={styles.input}
    type="number"
    value={form.startingNumber}
    onChange={set("startingNumber")}
  />

  <label className={styles.label}>Default Due Days</label>
  <input
    className={styles.input}
    type="number"
    value={form.defaultDueDays}
    onChange={set("defaultDueDays")}
  />

  <label className={styles.label}>GST Rate (%)</label>
  <input
    className={styles.input}
    type="number"
    value={form.gstRate}
    onChange={set("gstRate")}
    placeholder="10"
  />
</div>


{/* ✅ SMTP SETTINGS */}
<h1 className={styles.sectionTitle}>Email (SMTP) Settings</h1>

<div className={styles.formCard}>
  <label className={styles.label}>SMTP Host</label>
  <input className={styles.input} value={form.smtpHost} onChange={set("smtpHost")} />

  <label className={styles.label}>SMTP Port</label>
  <input
    className={styles.input}
    type="number"
    value={form.smtpPort}
    onChange={set("smtpPort")}
  />

  <label className={styles.label}>SMTP User</label>
  <input className={styles.input} value={form.smtpUser} onChange={set("smtpUser")} />

  <label className={styles.label}>SMTP Password</label>
  <input
    type="password"
    className={styles.input}
    value={form.smtpPassword}
    onChange={set("smtpPassword")}
  />

  <label className={styles.label}>From Email</label>
  <input className={styles.input} value={form.fromEmail} onChange={set("fromEmail")} />

  <label className={styles.label}>From Name</label>
  <input className={styles.input} value={form.fromName} onChange={set("fromName")} />
</div>


      <button className={styles.saveButton} disabled={saving} onClick={onSave}>
        Save Settings
      </button>
    </div>
  );
}
