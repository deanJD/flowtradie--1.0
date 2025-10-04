// client/app/dashboard/jobs/[jobId]/page.tsx
'use client';

import React, { use } from 'react';
import { useQuery } from '@apollo/client';
import { GET_JOB_QUERY } from '@/app/lib/graphql/queries/job';
import Link from 'next/link';

// The 'params' prop is automatically passed by Next.js to dynamic pages
export default function JobDetailsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);

  const { data, loading, error } = useQuery(GET_JOB_QUERY, {
    variables: { jobId },
  });

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.job) return <p>Job not found.</p>;

  const { job } = data;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/dashboard" style={{ color: 'blue', textDecoration: 'underline' }}>
        ← Back to Dashboard
      </Link>
      
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>{job.title}</h1>
      <p><strong>Status:</strong> {job.status}</p>
      <p><strong>Customer:</strong> {job.customer.name}</p>
      <p><strong>Description:</strong> {job.description || 'No description provided.'}</p>
      
      {/* vvvvvvvvvv NEW TASKS SECTION vvvvvvvvvv */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Tasks</h2>
        {job.tasks && job.tasks.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {job.tasks.map((task: any) => (
              <li key={task.id} style={{ marginBottom: '0.5rem', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                <input type="checkbox" checked={task.isCompleted} readOnly style={{ marginRight: '0.5rem' }} />
                {task.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks have been created for this job yet.</p>
        )}
      </div>
      {/* ^^^^^^^^^^ NEW TASKS SECTION ^^^^^^^^^^ */}
    </div>
  );
}