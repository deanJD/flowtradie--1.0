// client/app/dashboard/jobs/[jobId]/page.tsx
'use client';

import React, { use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_JOB_QUERY } from '@/app/lib/graphql/queries/job';
import { UPDATE_TASK_MUTATION } from '@/app/lib/graphql/mutations/task';
import Link from 'next/link';
import styles from './JobDetailsPage.module.css';

export default function JobDetailsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);

  const { data, loading, error, refetch } = useQuery(GET_JOB_QUERY, {
    variables: { jobId },
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

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.job) return <p>Job not found.</p>;

  const { job } = data;

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        ← Back to Dashboard
      </Link>
      
      <div className={styles.header}>
        <h1 className={styles.title}>{job.title}</h1>
        <div className={styles.metaGrid}>
          <p className={styles.metaItem}><strong>Status:</strong> {job.status}</p>
          <p className={styles.metaItem}><strong>Customer:</strong> {job.customer.name}</p>
        </div>
        <p className={styles.description}>{job.description || 'No description provided.'}</p>
      </div>
      
      {/* --- Quotes Section --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quotes</h2>
        {job.quotes && job.quotes.length > 0 ? (
          <ul className={styles.list}>
            {job.quotes.map((quote: any) => (
              <li key={quote.id} className={styles.listItem}>
                <Link href={`/dashboard/quotes/${quote.id}`}>
                  <span>{quote.quoteNumber} ({quote.status})</span>
                  <span>Total: ${quote.totalAmount.toFixed(2)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No quotes for this job yet.</p>
        )}
      </div>

      {/* --- Invoices Section --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Invoices</h2>
        {job.invoices && job.invoices.length > 0 ? (
          <ul className={styles.list}>
            {job.invoices.map((invoice: any) => (
              <li key={invoice.id} className={styles.listItem}>
                <Link href={`/dashboard/invoices/${invoice.id}`}>
                  <span>{invoice.invoiceNumber} ({invoice.status})</span>
                  <span>Total: ${invoice.totalAmount.toFixed(2)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invoices for this job yet.</p>
        )}
      </div>

      {/* --- Tasks Section --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Tasks</h2>
        {job.tasks && job.tasks.length > 0 ? (
          <ul className={styles.list}>
            {job.tasks.map((task: any) => (
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
          <p>No tasks for this job yet.</p>
        )}
      </div>
    </div>
  );
}