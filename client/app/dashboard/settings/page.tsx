'use client';

import { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import styles from './SettingsPage.module.css';

// ✅ Queries & Mutations
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
      fromName
    }
  }
`;

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
      fromName
    }
  }
`;

export default function SettingsPage() {
  const { data, loading, error } = useQuery(GET_INVOICE_SETTINGS);

  const [updateSettings, { loading: saving }] = useMutation(UPDATE_INVOICE_SETTINGS, {
    refetchQueries: [{ query: GET_INVOICE_SETTINGS }],
    awaitRefetchQueries: true,
  });

  const [form, setForm] = useState<any>({
    businessName: '',
    abn: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
    bankDetails: '',
    invoicePrefix: 'INV-',
    startingNumber: '1',
    defaultDueDays: '14',
    gstRate: '10',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
  });

  // ✅ Load DB settings
  useEffect(() => {
    if (!data?.invoiceSettings) return;
    const s = data.invoiceSettings;

    setForm({
      businessName: s.businessName ?? '',
      abn: s.abn ?? '',
      address: s.address ?? '',
      phone: s.phone ?? '',
      email: s.email ?? '',
      website: s.website ?? '',
      logoUrl: s.logoUrl ?? '',
      bankDetails: s.bankDetails ?? '',
      invoicePrefix: s.invoicePrefix ?? 'INV-',
      startingNumber: s.startingNumber?.toString() ?? '1',
      defaultDueDays: s.defaultDueDays?.toString() ?? '14',
      gstRate: s.gstRate != null ? String(s.gstRate * 100) : '10',
      smtpHost: s.smtpHost ?? '',
      smtpPort: s.smtpPort?.toString() ?? '',
      smtpUser: s.smtpUser ?? '',
      smtpPassword: s.smtpPassword ?? '',
      fromEmail: s.fromEmail ?? '',
      fromName: s.fromName ?? '',
    });
  }, [data]);

  // ✅ Update form values
  const set = (key: string) => (e: any) =>
    setForm((prev: any) => ({ ...prev, [key]: e.target.value }));

  // ✅ Prepare data for backend
  const buildPayload = () => ({
    businessName: form.businessName,
    abn: form.abn,
    address: form.address,
    phone: form.phone,
    email: form.email,
    website: form.website,
    logoUrl: form.logoUrl,
    bankDetails: form.bankDetails,
    invoicePrefix: form.invoicePrefix,
    startingNumber: form.startingNumber ? Number(form.startingNumber) : undefined,
    defaultDueDays: form.defaultDueDays ? Number(form.defaultDueDays) : undefined,
    gstRate: form.gstRate ? Number(form.gstRate) / 100 : undefined,
    smtpHost: form.smtpHost,
    smtpPort: form.smtpPort ? Number(form.smtpPort) : undefined,
    smtpUser: form.smtpUser,
    smtpPassword: form.smtpPassword,
    fromEmail: form.fromEmail,
    fromName: form.fromName,
  });

  const onSave = async () => {
    try {
      await updateSettings({ variables: { input: buildPayload() } });
      alert('Settings saved ✅');
    } catch (e: any) {
      console.error(e);
      alert('Failed to save settings.');
    }
  };

  if (loading) return <p>Loading settings…</p>;
  if (error) return <p>Error loading settings: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Invoice Settings</h1>

      <form className={styles.form}>
        {/* BUSINESS INFO */}
        <div className={styles.card}>
          <h2>Business Information</h2>

          {[
            'businessName',
            'abn',
            'address',
            'phone',
            'email',
            'website',
            'logoUrl',
            'bankDetails',
          ].map((field) => (
            <div key={field} className={styles.inputGroup}>
              <label>{field}</label>
              <input type="text" value={form[field]} onChange={set(field)} />
            </div>
          ))}
        </div>

        {/* INVOICE PREFERENCES */}
        <div className={styles.card}>
          <h2>Invoice Preferences</h2>

          <div className={styles.inputGroup}>
            <label>Invoice Prefix</label>
            <input value={form.invoicePrefix} onChange={set('invoicePrefix')} />
          </div>

          <div className={styles.inputGroup}>
            <label>Starting Number</label>
            <input type="number" value={form.startingNumber} onChange={set('startingNumber')} />
          </div>

          <div className={styles.inputGroup}>
            <label>Default Due Days</label>
            <input type="number" value={form.defaultDueDays} onChange={set('defaultDueDays')} />
          </div>

          <div className={styles.inputGroup}>
            <label>GST Rate (%)</label>
            <input type="number" value={form.gstRate} onChange={set('gstRate')} />
          </div>
        </div>

        {/* EMAIL SETTINGS */}
        <div className={styles.card}>
          <h2>Email Settings</h2>

          {[
            'smtpHost',
            'smtpPort',
            'smtpUser',
            'smtpPassword',
            'fromEmail',
            'fromName',
          ].map((field) => (
            <div key={field} className={styles.inputGroup}>
              <label>{field}</label>
              <input value={form[field]} onChange={set(field)} />
            </div>
          ))}
        </div>

        <button type="button" className={styles.saveBtn} disabled={saving} onClick={onSave}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
