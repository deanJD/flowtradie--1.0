// client/components/Header/Header.tsx
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext'; // Make sure this path is correct
import styles from './Header.module.css';

// Define your main navigation links
const mainNavLinks = [
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/clients', label: 'Clients' },
  { href: '/dashboard/invoices', label: 'Invoices' },
  { href: '/dashboard/team', label: 'Team' },
  { label: 'Settings', href: '/dashboard/settings' }, // ⚙️ The new link
  // Add other main links as needed
];

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Get current path for active link styling

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/dashboard">FlowTradie</Link>
      </div>

      {/* --- Main Navigation (Only show if logged in) --- */}
      {user && (
        <nav className={styles.navigation}>
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              // Add active class styling based on the current path
              className={`${styles.navLink} ${pathname.startsWith(link.href) ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
      {/* --- End Main Navigation --- */}

      {/* User Actions (Login/Logout) */}
      <div className={styles.userActions}>
        {user ? (
          <>
            <span>G'day, {user.name}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </header>
  );
}