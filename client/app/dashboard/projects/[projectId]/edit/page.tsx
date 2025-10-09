// client/app/dashboard/projects/[projectId]/edit/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_PROJECT_QUERY } from '@/app/lib/graphql/queries/project';
import { UPDATE_PROJECT_MUTATION } from '@/app/lib/graphql/mutations/project';
import Link from 'next/link';
import styles from './EditProjectPage.module.css';

export default function EditProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  // 1. Fetch the current project data to pre-fill the form
  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT_QUERY, {
    variables: { projectId },
  });

  // 2. Set up state for our form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 3. Use useEffect to populate the form once the data is fetched
  useEffect(() => {
    if (projectData && projectData.project) {
      setTitle(projectData.project.title);
      setDescription(projectData.project.description || '');
    }
  }, [projectData]);

  // 4. Set up the update mutation
  const [updateProject, { loading: updatingProject, error: updateError }] = useMutation(UPDATE_PROJECT_MUTATION, {
    onCompleted: () => {
      // On success, go back to the project details page
      router.push(`/dashboard/projects/${projectId}`);
    },
    refetchQueries: [{ query: GET_PROJECT_QUERY, variables: { projectId } }],
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateProject({
      variables: {
        updateProjectId: projectId,
        input: {
          title,
          description,
        },
      },
    });
  };

  if (projectLoading) return <p>Loading project for editing...</p>;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Edit Project</h1>

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
          <label htmlFor="description" className={styles.label}>Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            rows={4}
          />
        </div>

        {updateError && <p style={{ color: 'red' }}>Error: {updateError.message}</p>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className={styles.button} disabled={updatingProject}>
            {updatingProject ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/dashboard/projects/${projectId}`} className={styles.button} style={{ backgroundColor: '#ccc', textAlign: 'center' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}