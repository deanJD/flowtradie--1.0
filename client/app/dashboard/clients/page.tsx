// client/app/dashboard/clients/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';
import styles from './ClientsPage.module.css';
import Link from 'next/link';

export default function ClientsPage() {
  const { data, loading, error } = useQuery(GET_CLIENTS_QUERY);

  if (loading) return <p>Loading clients...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Clients</h1>
        <div className={styles.actions}>
          <input type="search" placeholder="Search clients..." className={styles.searchBar} />
          {/* We can wire this up to a 'Create New Client' page later */}
          <Link href="#" style={{padding: '0.5rem 1rem', backgroundColor: 'var(--primary-accent)', color: 'white', borderRadius: '6px', textDecoration: 'none'}}>
            + New Client
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.clients.map((client: any) => (
              <tr key={client.id}>
                <td>
                  {/* This will eventually link to a client details page */}
                  <Link href={`#`} style={{ color: 'var(--link-color)', fontWeight: 'bold' }}>
                    {client.name}
                  </Link>
                </td>
                <td>{client.email}</td>
                <td>{client.phone || 'N/A'}</td>
                <td>...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}