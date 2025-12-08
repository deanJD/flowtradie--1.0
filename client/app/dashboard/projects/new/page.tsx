// client/app/dashboard/projects/new/page.tsx
'use client';

import React, { useState, Suspense } from 'react'; // 👈 1. Import Suspense
import { useQuery, useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation'; // 👈 2. Import useSearchParams
import { GET_CLIENTS } from '@/app/lib/graphql/queries/clients';
import { CREATE_PROJECT_MUTATION } from '@/app/lib/graphql/mutations/project';
import { GET_PROJECTS } from '@/app/lib/graphql/queries/projects';
import styles from './NewProjectPage.module.css';
import Button from '@/components/Button/Button';

// 3. SEPARATE THE FORM LOGIC INTO A COMPONENT
function NewProjectForm() {
  const router = useRouter();
  
  // 👇 CAPTURE THE URL PARAMETER
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('clientId') || '';

  const { data: clientsData, loading: clientsLoading, error: clientsError } = useQuery(GET_CLIENTS);

  const [title, setTitle] = useState('');
  // 👇 SET INITIAL STATE TO THE URL PARAM
  const [clientId, setClientId] = useState(preselectedClientId); 
  const [description, setDescription] = useState('');

  const [createProject, { loading: creatingProject, error: createError }] = useMutation(CREATE_PROJECT_MUTATION, {
    update(cache, { data: { createProject } }) {
      type QueryData = { projects: any[] };
      const data = cache.readQuery<QueryData>({ query: GET_PROJECTS });
      if (data) {
        cache.writeQuery<QueryData>({
          query: GET_PROJECTS,
          data: { projects: [createProject, ...data.projects] },
        });
      }
    },
    onCompleted: (data) => {
      router.push(`/dashboard/projects/${data.createProject.id}`);
    },
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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Create a New Project</h1>

      <div className={styles.inputGroup}>
        <label htmlFor="title" className={styles.label}>Project Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} required />
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
              {client.businessName || `${client.firstName} ${client.lastName}`}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description" className={styles.label}>Description (Optional)</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input} rows={4} />
      </div>

      {createError && <p style={{ color: 'red' }}>Error: {createError.message}</p>}

      <div className={styles.buttonGroup}>
  <Button href="/dashboard/projects" variant="secondary">
    Cancel
  </Button>
  <Button type="submit" disabled={creatingProject}>
    {creatingProject ? 'Creating...' : 'Create Project'}
  </Button>
</div>
    </form>
  );
}

// 4. MAIN PAGE COMPONENT (WRAPPED IN SUSPENSE)
export default function NewProjectPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<p>Loading form...</p>}>
        <NewProjectForm />
      </Suspense>
    </div>
  );
}