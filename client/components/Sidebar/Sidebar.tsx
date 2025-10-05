// client/app/components/Sidebar/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

// Define our navigation links here
const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/invoices', label: 'Invoices' },
  { href: '/dashboard/clients', label: 'Clients' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        {navLinks.map((link) => {
          // Check if the current page's path matches the link's href
          const isActive = pathname === link.href;

          return (
            <li key={link.href} className={styles.navItem}>
              <Link
                href={link.href}
                className={isActive ? styles.activeLink : styles.link}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}