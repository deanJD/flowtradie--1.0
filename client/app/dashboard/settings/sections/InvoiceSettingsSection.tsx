'use client';
import React, { useState } from 'react';
import styles from './InvoiceSettings.module.css';
import SettingsCard from '../components/SettingsCard';
import SettingsInput from '../components/SettingsInput';
import SettingsSectionTitle from '../components/SettingsSectionTitle';
import { useMutation, gql } from '@apollo/client';

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
      invoicePrefix
      startingNumber
      defaultDueDays
      gstRate
      bankDetails
    }
  }
`;

export default function InvoiceSettingsSection() {
  const [form, setForm] = useState({
    businessName: '',
    abn: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    invoicePrefix: 'INV-',
    startingNumber: 1000,
    defaultDueDays: 14,
    gstRate: 10,
    bankDetails: '',
  });

  const [updateSettings, { loading, error }] = useMutation(UPDATE_INVOICE_SETTINGS);

  const handleChange = (key: string, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await updateSettings({ variables: { input: form } });
    alert('Settings saved successfully!');
  };

  return (
    <div className={styles.section}>
      <SettingsSectionTitle
        title="Invoice Settings"
        description="Update your business and invoice preferences."
      />

      <SettingsCard>
        <h4>Business Information</h4>
        <SettingsInput label="Business Name" value={form.businessName} onChange={e => handleChange('businessName', e.target.value)} />
        <SettingsInput label="ABN" value={form.abn} onChange={e => handleChange('abn', e.target.value)} />
        <SettingsInput label="Address" value={form.address} onChange={e => handleChange('address', e.target.value)} />
        <SettingsInput label="Phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
        <SettingsInput label="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
        <SettingsInput label="Website" value={form.website} onChange={e => handleChange('website', e.target.value)} />
      </SettingsCard>

      <SettingsCard>
        <h4>Invoice Preferences</h4>
        <SettingsInput label="Invoice Prefix" value={form.invoicePrefix} onChange={e => handleChange('invoicePrefix', e.target.value)} />
        <SettingsInput label="Starting Number" type="number" value={form.startingNumber} onChange={e => handleChange('startingNumber', Number(e.target.value))} />
        <SettingsInput label="Default Due Days" type="number" value={form.defaultDueDays} onChange={e => handleChange('defaultDueDays', Number(e.target.value))} />
        <SettingsInput label="GST Rate (%)" type="number" value={form.gstRate} onChange={e => handleChange('gstRate', Number(e.target.value))} />
        <SettingsInput label="Bank Details" value={form.bankDetails} onChange={e => handleChange('bankDetails', e.target.value)} />
      </SettingsCard>

      <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
        {loading ? 'Saving…' : 'Save Settings'}
      </button>

      {error && <p className={styles.error}>Error: {error.message}</p>}
    </div>
  );
}
