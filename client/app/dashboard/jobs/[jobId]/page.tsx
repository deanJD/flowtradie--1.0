// client/app/dashboard/projects/[projectId]/page.tsx
'use client';

import React, { use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_JOB_QUERY } from '@/app/lib/graphql/queries/project';
import { UPDATE_TASK_MUTATION } from '@/app/lib/graphql/mutations/task';
import Link from 'next/link';
import styles from './ProjectDetailsPage.module.css';

export default function ProjectDetailsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  const { data, loading, error, refetch } = useQuery(GET_JOB_QUERY, {
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
      <Link href="/dashboard" className={styles.backLink}>
        ← Back to Dashboard
      </Link>
      
      <div className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        <div className={styles.metaGrid}>
          <p className={styles.metaItem}><strong>Status:</strong> {project.status}</p>
          <p className={styles.metaItem}><strong>Client:</strong> {project.client.name}</p>
        </div>
        <p className={styles.description}>{project.description || 'No description provided.'}</p>
      </div>
      
      {/* --- Quotes Section --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quotes</h2>
        {project.quotes && project.quotes.length > 0 ? (
          <ul className={styles.list}>
            {project.quotes.map((quote: any) => (
              <li key={quote.id} className={styles.listItem}>
                <Link href={`/dashboard/quotes/${quote.id}`}>
                  <span>{quote.quoteNumber} ({quote.status})</span>
                  <span>Total: ${quote.totalAmount.toFixed(2)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No quotes for this project yet.</p>
        )}
      </div>

      {/* --- Invoices Section --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Invoices</h2>
        {project.invoices && project.invoices.length > 0 ? (
          <ul className={styles.list}>
            {project.invoices.map((invoice: any) => (
              <li key={invoice.id} className={styles.listItem}>
                <Link href={`/dashboard/invoices/${invoice.id}`}>
                  <span>{invoice.invoiceNumber} ({invoice.status})</span>
                  <span>Total: ${invoice.totalAmount.toFixed(2)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invoices for this project yet.</p>
        )}
      </div>

      {/* --- Tasks Section --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Tasks</h2>
        {project.tasks && project.tasks.length > 0 ? (
          <ul className={styles.list}>
            {project.tasks.map((task: any) => (
              <li key={task.id} className={styles.listItem} style={{ textDecoration: task.isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}
                onClick={() => handleToggleTask(task)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={task.isCompleted} 
                    readOnly 
                    style={{ marginRight: '0.5rem' }} 
                  />
                  <span>{task.title}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks for this project yet.</p>
        )}
      </div>
    </div>
  );
}