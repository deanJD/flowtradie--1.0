'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import InvoiceSettingsSection from './sections/InvoiceSettingsSection';
import styles from './SettingsLayout.module.css';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'invoices';

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Settings</h2>
        <nav>
          <a href="?tab=invoices" className={tab === 'invoices' ? styles.active : ''}>Invoices</a>
          <a href="?tab=projects" className={tab === 'projects' ? styles.active : ''}>Projects</a>
          <a href="?tab=clients" className={tab === 'clients' ? styles.active : ''}>Clients</a>
        </nav>
      </aside>

      <main className={styles.main}>
        {tab === 'invoices' && <InvoiceSettingsSection />}
        {tab === 'projects' && <p>Project settings coming soon...</p>}
        {tab === 'clients' && <p>Client settings coming soon...</p>}
      </main>
    </div>
  );
}
