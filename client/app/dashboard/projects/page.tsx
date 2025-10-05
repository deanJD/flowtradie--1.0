// client/app/dashboard/projects/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects';
import styles from './ProjectsPage.module.css';
import Link from 'next/link';

// A helper function to get the right style for each status
const getStatusClass = (status: string) => {
  // You can customize these colors later
  switch (status) {
    case 'COMPLETED': return styles.statusPaid; // Using green from invoice styles
    case 'ACTIVE': return styles.statusSent; // Using blue from invoice styles
    case 'PENDING': return styles.statusDraft; // Using gray from invoice styles
    default: return styles.statusDraft;
  }
};

export default function ProjectsPage() {
  const { data, loading, error } = useQuery(GET_PROJECTS_QUERY);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <div className={styles.actions}>
          <input type="search" placeholder="Search projects..." className={styles.searchBar} />
          <Link href="/dashboard/projects/new" style={{padding: '0.5rem 1rem', backgroundColor: 'var(--primary-accent)', color: 'white', borderRadius: '6px', textDecoration: 'none'}}>
            + New Project
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Client</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.projects.map((project: any) => (
              <tr key={project.id}>
                <td>
                  <Link href={`/dashboard/projects/${project.id}`} style={{ color: 'var(--link-color)', fontWeight: 'bold' }}>
                    {project.title}
                  </Link>
                </td>
                <td>{project.client.name}</td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td>...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}