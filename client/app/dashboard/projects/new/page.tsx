// client/app/dashboard/projects/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMERS_QUERY } from '@/app/lib/graphql/queries/clients';
import Link from 'next/link';
import styles from './NewProjectPage.module.css';

export default function NewProjectPage() {
  // Fetch clients for the dropdown
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useQuery(GET_CUSTOMERS_QUERY);

  // State for the form fields
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Creating project with:', { title, clientId, description });
    // We'll add the createProject mutation logic here next
  };

  if (clientsLoading) return <p>Loading clients...</p>;
  if (clientsError) return <p>Error loading clients: {clientsError.message}</p>;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create a New Project</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="title" className={styles.label}>Project Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="client" className={styles.label}>Client</label>
          <select
            id="client"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className={styles.input}
            required
          >
            <option value="" disabled>Select a client</option>
            {clientsData?.clients.map((client: any) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description" className={styles.label}>Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            rows={4}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className={styles.button}>
            Create Project
          </button>
          <Link href="/dashboard" className={styles.button} style={{ backgroundColor: '#ccc', textAlign: 'center' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}