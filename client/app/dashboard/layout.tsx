// client/app/dashboard/layout.tsx
import React from 'react';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar"; // <-- 1. Import the Sidebar
import styles from './DashboardLayout.module.css';     // <-- 2. Import the new styles

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className={styles.layoutContainer}>
        <Sidebar /> {/* <-- 3. Render the Sidebar */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}