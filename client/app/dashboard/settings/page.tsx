// client/app/dashboard/settings/page.tsx
'use client';

import React, { useEffect, useState, useRef } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import styles from "./SettingsPage.module.css";

// 1. QUERY
const GET_INVOICE_SETTINGS = gql`
  query GetInvoiceSettings {
    invoiceSettings {
      id
      businessName
      legalName
      registrationNumber
      
      phone
      email
      website
      logoUrl
      bankDetails
      
      invoicePrefix
      startingNumber
      defaultDueDays
      taxRate
      taxLabel
      
      smtpHost
      smtpPort
      smtpUser
      smtpPassword
      fromEmail
      fromName

      address {
        line1
        line2
        city
        state
        postcode
        country
      }
    }
  }
`;

// 2. MUTATION
const UPDATE_INVOICE_SETTINGS = gql`
  mutation UpdateInvoiceSettings($input: InvoiceSettingsInput!) {
    updateInvoiceSettings(input: $input) {
      id
      businessName
      registrationNumber
    }
  }
`;

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, loading } = useQuery(GET_INVOICE_SETTINGS);
  
  const [updateSettings, { loading: saving }] = useMutation(UPDATE_INVOICE_SETTINGS, {
    refetchQueries: [{ query: GET_INVOICE_SETTINGS }],
  });

  // Form State
  const [form, setForm] = useState({
    businessName: "",
    legalName: "",
    registrationNumber: "",
    
    phone: "",
    email: "",
    website: "",
    logoUrl: "",
    bankDetails: "",
    
    invoicePrefix: "INV-",
    startingNumber: "1000",
    defaultDueDays: "14",
    taxRate: "10",
    taxLabel: "GST",
    
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },

    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
  });

  // Load Data
  useEffect(() => {
    if (data?.invoiceSettings) {
      const s = data.invoiceSettings;
      setForm((prev) => ({
        ...prev,
        ...s,
        // Ensure strictly strings for inputs to avoid 'uncontrolled' warnings
        legalName: s.legalName || "",
        registrationNumber: s.registrationNumber || "",
        phone: s.phone || "",
        email: s.email || "",
        website: s.website || "",
        logoUrl: s.logoUrl || "",
        bankDetails: s.bankDetails || "",
        smtpHost: s.smtpHost || "",
        smtpUser: s.smtpUser || "",
        smtpPassword: s.smtpPassword || "",
        fromEmail: s.fromEmail || "",
        fromName: s.fromName || "",
        
        // Map Address specifically
        address: {
          line1: s.address?.line1 ?? "",
          line2: s.address?.line2 ?? "",
          city: s.address?.city ?? "",
          state: s.address?.state ?? "",
          postcode: s.address?.postcode ?? "",
          country: s.address?.country ?? "",
        },
        // Format Numbers
        startingNumber: s.startingNumber?.toString() ?? "1000",
        defaultDueDays: s.defaultDueDays?.toString() ?? "14",
        taxRate: s.taxRate ? (s.taxRate * 100).toString() : "10",
        smtpPort: s.smtpPort?.toString() ?? "",
      }));
    }
  }, [data]);

  // Handlers
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => 
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const setAddress = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ 
      ...p, 
      address: { ...p.address, [key]: e.target.value } 
    }));

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload-logo", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        setForm(prev => ({ ...prev, logoUrl: data.url }));
      } catch (err) {
        alert("Failed to upload logo.");
      }
    }
  };

  const onSave = async () => {
    try {
      // 1. Destructure to ISOLATE the allowed fields.
      // We explicitly exclude 'id' and '__typename' which cause the error.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, __typename, address, ...cleanProps } = form as any;

      await updateSettings({
        variables: {
          input: {
            ...cleanProps,
            // 2. Explicitly cast numbers
            startingNumber: Number(form.startingNumber),
            defaultDueDays: Number(form.defaultDueDays),
            taxRate: Number(form.taxRate) / 100,
            smtpPort: Number(form.smtpPort) || 0,
            // 3. Pass clean address object
            address: {
              line1: form.address.line1,
              line2: form.address.line2,
              city: form.address.city,
              state: form.address.state,
              postcode: form.address.postcode,
              country: form.address.country,
            }, 
          }
        }
      });
      alert("Settings saved successfully! ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    }
  };

  if (loading) return <div className={styles.wrapper}>Loading settings...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Account & Settings</h1>
        <p className={styles.pageSubtitle}>Manage your company profile and invoice branding.</p>
      </div>

      {/* --- CARD 1: IDENTITY --- */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Company Identity</h3>
        <div className={styles.grid}>
           <div className={styles.formGroup}>
            <label className={styles.label}>Company Logo</label>
            <div 
              className={styles.logoDropArea}
              onClick={() => fileInputRef.current?.click()}
            >
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="Logo" className={styles.logoPreview} />
              ) : (
                <span style={{fontSize: '24px'}}>📷</span>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Business Name</label>
            <input className={styles.input} value={form.businessName} onChange={set("businessName")} />
            
            <label className={styles.label} style={{marginTop: '10px'}}>Legal Name</label>
            <input className={styles.input} value={form.legalName} onChange={set("legalName")} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Registration / Tax Number</label>
            <input className={styles.input} value={form.registrationNumber} onChange={set("registrationNumber")} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Website</label>
            <input className={styles.input} value={form.website} onChange={set("website")} />
          </div>
        </div>
      </div>
      
      {/* --- CARD 2: ADDRESS --- */}
       <div className={styles.card}>
        <h3 className={styles.cardTitle}>Business Address</h3>
        <div className={styles.grid}>
           <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Street Address</label>
            <input className={styles.input} value={form.address.line1} onChange={setAddress("line1")} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input className={styles.input} value={form.address.city} onChange={setAddress("city")} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>State</label>
            <input className={styles.input} value={form.address.state} onChange={setAddress("state")} />
          </div>
           <div className={styles.formGroup}>
            <label className={styles.label}>Postcode</label>
            <input className={styles.input} value={form.address.postcode} onChange={setAddress("postcode")} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Country</label>
            <input className={styles.input} value={form.address.country} onChange={setAddress("country")} />
          </div>
        </div>
      </div>

      {/* --- CARD 3: INVOICE CONFIG --- */}
       <div className={styles.card}>
        <h3 className={styles.cardTitle}>Invoicing Defaults</h3>
        <div className={styles.grid}>
           <div className={styles.formGroup}>
            <label className={styles.label}>Invoice Prefix</label>
            <input className={styles.input} value={form.invoicePrefix} onChange={set("invoicePrefix")} />
          </div>
           <div className={styles.formGroup}>
            <label className={styles.label}>Next Number</label>
            <input className={styles.input} value={form.startingNumber} onChange={set("startingNumber")} />
          </div>
           <div className={styles.formGroup}>
            <label className={styles.label}>Tax Label</label>
            <input className={styles.input} value={form.taxLabel} onChange={set("taxLabel")} />
          </div>
           <div className={styles.formGroup}>
            <label className={styles.label}>Tax Rate (%)</label>
            <input className={styles.input} value={form.taxRate} onChange={set("taxRate")} />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Bank Details</label>
            <input className={styles.input} value={form.bankDetails} onChange={set("bankDetails")} />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.saveButton} onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}