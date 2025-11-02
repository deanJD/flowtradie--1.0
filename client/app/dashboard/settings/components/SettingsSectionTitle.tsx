import React from 'react';
import styles from './SettingsSectionTitle.module.css';

export default function SettingsSectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className={styles.header}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
