// client/app/dashboard/projects/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';
import { CREATE_PROJECT_MUTATION } from '@/app/lib/graphql/mutations/project';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects'; // <-- 1. Import the query
import Link from 'next/link';
import styles from './NewProjectPage.module.css';

export default function NewProjectPage() {
  const router = useRouter();
  
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useQuery(GET_CLIENTS_QUERY);

  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');

  const [createProject, { loading: creatingProject, error: createError }] = useMutation(CREATE_PROJECT_MUTATION, {
    onCompleted: (data) => {
      const newProjectId = data.createProject.id;
      router.push(`/dashboard/projects/${newProjectId}`);
    },
    // 2. This is the more reliable way to refetch
    refetchQueries: [{ query: GET_PROJECTS_QUERY }],
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createProject({
      variables: {
        input: {
          title,
          clientId,
          description,
        },
      },
    });
  };

  if (clientsLoading) return <p>Loading clients...</p>;
  if (clientsError) return <p>Error loading clients: {clientsError.message}</p>;

  // ... (The rest of your form JSX is the same)
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create a New Project</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="title" className={styles.label}>Project Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="client" className={styles.label}>Client</label>
          <select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)} className={styles.input} required >
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
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input} rows={4} />
        </div>

        {createError && <p style={{ color: 'red' }}>Error: {createError.message}</p>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className={styles.button} disabled={creatingProject}>
            {creatingProject ? 'Creating...' : 'Create Project'}
          </button>
          <Link href="/dashboard/projects" className={styles.button} style={{ backgroundColor: '#ccc', textAlign: 'center' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}