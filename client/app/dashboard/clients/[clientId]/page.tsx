// client/app/dashboard/clients/[clientId]/page.tsx
'use client';

import React, { use } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CLIENT_QUERY } from '@/app/lib/graphql/queries/client';
import Link from 'next/link';
import styles from './ClientDetailsPage.module.css';
import Button from '@/components/Button/Button';

export default function ClientDetailsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);

  const { data, loading, error } = useQuery(GET_CLIENT_QUERY, {
    variables: { clientId },
  });

  if (loading) return <p>Loading client details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.client) return <p>Client not found.</p>;

  const { client } = data;

  return (
    <div className={styles.container}>
      <Link href="/dashboard/clients" className={styles.backLink}>
        ← Back to All Clients
      </Link>
      
      <div className={styles.header}>
        {/* THIS IS THE FIX: Using a className instead of inline style */}
        <div className={styles.headerMain}>
          <h1 className={styles.title}>{client.name}</h1>
          <Button href={`/dashboard/clients/${client.id}/edit`} variant="secondary">
            Edit
          </Button>
        </div>
        <div className={styles.metaGrid}>
          <p className={styles.metaItem}><strong>Email:</strong> {client.email}</p>
          <p className={styles.metaItem}><strong>Phone:</strong> {client.phone || 'N/A'}</p>
        </div>
        <p className={styles.description}>{client.address || 'No address on file.'}</p>
      </div>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Projects for this Client</h2>
        {client.projects && client.projects.length > 0 ? (
          <ul className={styles.list}>
            {client.projects.map((project: any) => (
              <li key={project.id} className={styles.listItem}>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <span>{project.title}</span>
                  <span>{project.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects for this client yet.</p>
        )}
      </div>
    </div>
  );
}