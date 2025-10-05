// client/app/components/Header/Header.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/dashboard">FlowTradie</Link>
      </div>
      {user && (
        <div className={styles.userInfo}>
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      )}
    </header>
  );
}