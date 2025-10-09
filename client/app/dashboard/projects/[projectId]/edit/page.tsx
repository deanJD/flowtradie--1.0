// client/app/dashboard/projects/[projectId]/edit/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_PROJECT_QUERY } from '@/app/lib/graphql/queries/project';
import { UPDATE_PROJECT_MUTATION, DELETE_PROJECT_MUTATION } from '@/app/lib/graphql/mutations/project'; // <-- Import DELETE
import Link from 'next/link';
import styles from './EditProjectPage.module.css';

export default function EditProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT_QUERY, {
    variables: { projectId },
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (projectData && projectData.project) {
      setTitle(projectData.project.title);
      setDescription(projectData.project.description || '');
    }
  }, [projectData]);

  const [updateProject, { loading: updatingProject, error: updateError }] = useMutation(UPDATE_PROJECT_MUTATION, {
    onCompleted: () => {
      router.push(`/dashboard/projects/${projectId}`);
    },
    refetchQueries: [{ query: GET_PROJECT_QUERY, variables: { projectId } }, 'GetProjects'],
  });

  // vvvvvvvvvv NEW DELETE LOGIC vvvvvvvvvv
  const [deleteProject, { loading: deletingProject, error: deleteError }] = useMutation(DELETE_PROJECT_MUTATION, {
    onCompleted: () => {
      // On success, go back to the main projects list
      router.push('/dashboard/projects');
    },
    // This is crucial: it tells Apollo to refetch the 'GetProjects' query,
    // so the deleted project disappears from the list.
    refetchQueries: ['GetProjects'], 
  });

  const handleDelete = () => {
    // Show a native browser confirmation dialog for safety
    if (window.confirm('Are you sure you want to permanently delete this project? This action cannot be undone.')) {
      deleteProject({
        variables: {
          deleteProjectId: projectId,
        },
      });
    }
  };
  // ^^^^^^^^^^ NEW DELETE LOGIC ^^^^^^^^^^

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
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description" className={styles.label}>Description (Optional)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input} rows={4} />
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

      {/* vvvvvvvvvv NEW DELETE BUTTON SECTION vvvvvvvvvv */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Danger Zone</h2>
        <button onClick={handleDelete} className={styles.deleteButton} disabled={deletingProject}>
          {deletingProject ? 'Deleting...' : 'Delete this Project'}
        </button>
        {deleteError && <p style={{ color: 'red', marginTop: '0.5rem' }}>Error: {deleteError.message}</p>}
      </div>
      {/* ^^^^^^^^^^ NEW DELETE BUTTON SECTION ^^^^^^^^^^ */}
    </div>
  );
}