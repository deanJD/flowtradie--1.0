"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COMPANY_SETTINGS } from "@/app/lib/graphql/queries/companySettings";
import { UPDATE_COMPANY_SETTINGS } from "@/app/lib/graphql/mutations/updateCompanySettings";
import styles from "./Settings.module.css";

type FormShape = {
  businessName: string;
  abn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  bankDetails: string;
};

const EMPTY: FormShape = {
  businessName: "",
  abn: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  logoUrl: "",
  bankDetails: "",
};

export default function CompanySettingsPage() {
  const { data, loading: loadingQuery, error: errorQuery } = useQuery(GET_COMPANY_SETTINGS);
  const [updateSettings, { loading: saving }] = useMutation(UPDATE_COMPANY_SETTINGS, {
    refetchQueries: [{ query: GET_COMPANY_SETTINGS }],
    awaitRefetchQueries: true,
  });

  const [form, setForm] = useState<FormShape>(EMPTY);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ Convert null → "" when loading DB values
  useEffect(() => {
    if (data?.companySettings) {
      const { id, __typename, ...rest } = data.companySettings;
      const cleaned = Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [k, v ?? ""])
      ) as FormShape;
      setForm(cleaned);
    }
  }, [data]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrorMsg(null);
  };

  const initial = useMemo<FormShape>(() => {
    if (!data?.companySettings) return EMPTY;
    const { id, __typename, ...rest } = data.companySettings;
    return { ...(EMPTY as FormShape), ...(rest as Partial<FormShape>) };
  }, [data]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);
  const canSave = isDirty && !saving && !loadingQuery;

  const basicValidate = (): string | null => {
    if (!form.businessName.trim()) return "Business name is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (form.website && !/^https?:\/\/.+/i.test(form.website))
      return "Website should start with http:// or https://";
    return null;
  };

  const onSave = async () => {
    const err = basicValidate();
    if (err) {
      setErrorMsg(err);
      setSavedAt(null);
      return;
    }
    try {
      // ✅ Strip __typename before mutation
      const { __typename, ...cleanForm } = form as any;
      await updateSettings({ variables: { input: cleanForm } });

      setSavedAt(Date.now());
      setErrorMsg(null);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Failed to save settings.");
      setSavedAt(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Company Settings</h1>
        <p className={styles.subtitle}>These details appear on new invoices.</p>
      </div>

      <div className={styles.card}>
        {loadingQuery && <div className={styles.info}>Loading company settings…</div>}
        {errorQuery && <div className={styles.error}>Failed to load settings: {errorQuery.message}</div>}
        {savedAt && <div className={styles.success}>Settings updated successfully.</div>}
        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <div className={styles.grid}>
          {/* Column 1 */}
          <div className={styles.inputGroup}>
            <label htmlFor="businessName" className={styles.label}>Business Name *</label>
            <input
              id="businessName"
              name="businessName"
              value={form.businessName}
              onChange={onChange}
              className={styles.input}
              placeholder="FlowTradie Pty Ltd"
              disabled={loadingQuery || saving}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="abn" className={styles.label}>ABN</label>
            <input
              id="abn"
              name="abn"
              value={form.abn}
              onChange={onChange}
              className={styles.input}
              placeholder="12 345 678 901"
              disabled={loadingQuery || saving}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>Phone</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              className={styles.input}
              placeholder="0400 000 000"
              disabled={loadingQuery || saving}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className={styles.input}
              placeholder="accounts@yourcompany.com"
              disabled={loadingQuery || saving}
            />
          </div>

          {/* Column 2 */}
          <div className={styles.inputGroup}>
            <label htmlFor="website" className={styles.label}>Website</label>
            <input
              id="website"
              name="website"
              value={form.website}
              onChange={onChange}
              className={styles.input}
              placeholder="https://example.com"
              disabled={loadingQuery || saving}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="logoUrl" className={styles.label}>Logo URL</label>
            <input
              id="logoUrl"
              name="logoUrl"
              value={form.logoUrl}
              onChange={onChange}
              className={styles.input}
              placeholder="https://…/logo.png"
              disabled={loadingQuery || saving}
            />
          </div>

          <div className={styles.inputGroupFull}>
            <label htmlFor="address" className={styles.label}>Address</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={onChange}
              className={styles.input}
              placeholder="123 Main St, Perth WA"
              disabled={loadingQuery || saving}
            />
          </div>

          <div className={styles.inputGroupFull}>
            <label htmlFor="bankDetails" className={styles.label}>Bank Details</label>
            <textarea
              id="bankDetails"
              name="bankDetails"
              value={form.bankDetails}
              onChange={onChange}
              className={styles.textarea}
              rows={3}
              placeholder="BSB 123-456 · ACC 12345678"
              disabled={loadingQuery || saving}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={onSave}
            disabled={!canSave}
            aria-disabled={!canSave}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {!isDirty && !saving && (
            <span className={styles.muted}>No changes</span>
          )}
        </div>
      </div>
    </div>
  );
}
