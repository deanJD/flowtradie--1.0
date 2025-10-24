// client/app/dashboard/layout.tsx
'use client'; // Still needed if Header uses client-side hooks

import React from 'react';
import styles from './DashboardLayout.module.css';
import Header from '@/components/Header/Header'; // Adjust path if needed

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardLayout}>
      <Header />
      {/* Removed the contentArea div and the Sidebar */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}