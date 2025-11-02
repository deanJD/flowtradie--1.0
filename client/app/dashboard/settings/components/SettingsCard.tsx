import React from 'react';
import styles from './SettingsCard.module.css';

export default function SettingsCard({ children }: { children: React.ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}
