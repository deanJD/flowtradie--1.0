// client/app/dashboard/settings/components/SettingsInput.tsx
import React from "react";
import styles from "./SettingsInput.module.css";

interface Props {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SettingsInput({ label, type = "text", value, onChange }: Props) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
