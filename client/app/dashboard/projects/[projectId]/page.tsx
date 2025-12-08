// client/app/dashboard/projects/[projectId]/page.tsx
'use client';

import React, { use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECT } from '@/app/lib/graphql/queries/project';
import { UPDATE_TASK_MUTATION } from '@/app/lib/graphql/mutations/task';
import Link from 'next/link';
import styles from './ProjectDetailsPage.module.css';

export default function ProjectDetailsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  const { data, loading, error, refetch } = useQuery(GET_PROJECT, {
    variables: { projectId },
  });

  const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
    onCompleted: () => refetch(),
  });

  const handleToggleTask = (task: any) => {
    updateTask({
      variables: {
        updateTaskId: task.id,
        input: {
          isCompleted: !task.isCompleted,
        },
      },
    });
  };

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.project) return <p>Project not found.</p>;

  const { project } = data;

  return (
    <div className={styles.container}>
      <Link href="/dashboard/projects" className={styles.backLink}>
        ← Back to All Projects
      </Link>
      
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 className={styles.title}>{project.title}</h1>
          {/* vvvvvvvvvv NEW BUTTON ADDED BELOW vvvvvvvvvv */}
          <Link 
            href={`/dashboard/projects/${project.id}/edit`} 
            className={styles.editButton} // We will add this style next
          >
            Edit
          </Link>
          {/* ^^^^^^^^^^ NEW BUTTON ADDED ABOVE ^^^^^^^^^^ */}
        </div>
        <div className={styles.metaGrid}>
          <p className={styles.metaItem}><strong>Status:</strong> {project.status}</p>
          <p className={styles.metaItem}><strong>Client:</strong> {project.client.name}</p>
        </div>
        <p className={styles.description}>{project.description || 'No description provided.'}</p>
      </div>
      
      {/* ... Quotes, Invoices, and Tasks sections ... */}
    </div>
  );
}