"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COMPANY_SETTINGS } from "../lib/graphql/queries/companySettings";
import { UPDATE_COMPANY_SETTINGS } from "../lib/graphql/mutations/updateCompanySettings";


export default function CompanySettingsPage() {
  const { data, loading } = useQuery(GET_COMPANY_SETTINGS);
  const [updateSettings] = useMutation(UPDATE_COMPANY_SETTINGS);

  const [form, setForm] = useState({
    businessName: "",
    abn: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logoUrl: "",
    bankDetails: ""
  });

  useEffect(() => {
    if (data?.companySettings) {
      setForm({ ...data.companySettings });
    }
  }, [data]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateSettings({ variables: { input: form } });
    alert("Settings updated successfully ✅");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Company Settings</h1>
      <p>Update your business details for invoices.</p>

      {Object.keys(form).map((key) => (
        <div key={key} style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            {key}
          </label>
          <input
            type="text"
            name={key}
            value={(form as any)[key] || ""}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        style={{
          padding: "10px 16px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Save Settings
      </button>
    </div>
  );
}
