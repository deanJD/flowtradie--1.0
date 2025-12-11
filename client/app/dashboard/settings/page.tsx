'use client';

import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import styles from "./SettingsPage.module.css";

// 1️⃣ UPDATE QUERY: Using Nested Address
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
      taxRate
      taxLabel
      smtpHost
      smtpPort
      smtpUser
      smtpPassword
      fromEmail
      fromName

      # ✅ Nested Address Object
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

const UPDATE_INVOICE_SETTINGS = gql`
  mutation UpdateInvoiceSettings($input: InvoiceSettingsInput!) {
    updateInvoiceSettings(input: $input) {
      id
      businessName
      address {
        line1
        city
        postcode
      }
    }
  }
`;

export default function SettingsPage() {
  const { data, loading } = useQuery(GET_INVOICE_SETTINGS);
  const [updateSettings, { loading: saving }] = useMutation(UPDATE_INVOICE_SETTINGS, {
    refetchQueries: [{ query: GET_INVOICE_SETTINGS }],
  });

  // 2️⃣ STATE: Grouped Address
  const [form, setForm] = useState<any>({
    businessName: "",
    abn: "",
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
    
    // Address Group
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },

    // SMTP
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
  });

  // 3️⃣ LOAD DATA
  useEffect(() => {
    if (data?.invoiceSettings) {
      const s = data.invoiceSettings;
      setForm({
        ...s,
        // Ensure defaults if null
        address: {
          line1: s.address?.line1 ?? "",
          line2: s.address?.line2 ?? "",
          city: s.address?.city ?? "",
          state: s.address?.state ?? "",
          postcode: s.address?.postcode ?? "",
          country: s.address?.country ?? "",
        },
        // Convert numbers to strings for inputs
        startingNumber: s.startingNumber?.toString() ?? "1000",
        defaultDueDays: s.defaultDueDays?.toString() ?? "14",
        taxRate: s.taxRate ? (s.taxRate * 100).toString() : "10",
        smtpPort: s.smtpPort?.toString() ?? "",
      });
    }
  }, [data]);

  // Helpers
  const set = (key: string) => (e: any) => 
    setForm((p: any) => ({ ...p, [key]: e.target.value }));

  const setAddress = (key: string) => (e: any) =>
    setForm((p: any) => ({ 
      ...p, 
      address: { ...p.address, [key]: e.target.value } 
    }));

  const onSave = async () => {
    try {
      await updateSettings({
        variables: {
          input: {
            ...form,
            // Convert types back for API
            startingNumber: Number(form.startingNumber),
            defaultDueDays: Number(form.defaultDueDays),
            taxRate: Number(form.taxRate) / 100,
            smtpPort: Number(form.smtpPort),
            
            // Nested Address is passed directly
            address: form.address, 
          }
        }
      });
      alert("Settings saved ✅");
    } catch (err) {
      alert("Failed to save settings");
      console.error(err);
    }
  };

  // ✅ Main upload handler (Reuse your existing logic)
  const handleLogoUpload = async (file: File) => {
     // ... (Keep your existing logo upload logic here) ...
     // Just ensure it updates: setForm(prev => ({ ...prev, logoUrl: data.url }))
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      {/* ... Logo Section (Keep existing UI) ... */}

      <div className={styles.formCard}>
        <h2 className={styles.sectionTitle}>Business Details</h2>
        <label className={styles.label}>Business Name</label>
        <input className={styles.input} value={form.businessName} onChange={set("businessName")} />
        
        <label className={styles.label}>ABN / Registration</label>
        <input className={styles.input} value={form.abn} onChange={set("abn")} />

        {/* 4️⃣ NESTED ADDRESS INPUTS */}
        <label className={styles.label}>Address</label>
        <input 
          className={styles.input} 
          placeholder="Street" 
          value={form.address.line1} 
          onChange={setAddress("line1")} 
        />
        <input 
          className={styles.input} 
          placeholder="City" 
          value={form.address.city} 
          onChange={setAddress("city")} 
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            className={styles.input} 
            placeholder="State" 
            value={form.address.state} 
            onChange={setAddress("state")} 
          />
          <input 
            className={styles.input} 
            placeholder="Postcode" 
            value={form.address.postcode} 
            onChange={setAddress("postcode")} 
          />
        </div>
        <input 
            className={styles.input} 
            placeholder="Country" 
            value={form.address.country} 
            onChange={setAddress("country")} 
        />

        <label className={styles.label}>Contact</label>
        <input className={styles.input} placeholder="Phone" value={form.phone} onChange={set("phone")} />
        <input className={styles.input} placeholder="Email" value={form.email} onChange={set("email")} />
        <input className={styles.input} placeholder="Website" value={form.website} onChange={set("website")} />
      </div>

      {/* ... Invoice Settings & SMTP Cards (Update inputs to use form.startingNumber etc.) ... */}
      
      <button className={styles.saveButton} disabled={saving} onClick={onSave}>
        Save Settings
      </button>
    </div>
  );
}