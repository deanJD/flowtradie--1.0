// client/app/dashboard/projects/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects';
import styles from './ProjectsPage.module.css';
import Link from 'next/link';
import DataTable from '@/components/DataTable/DataTable'; // <-- Import our new component

// Helper function to get the right style for each status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'COMPLETED': return styles.statusPaid;
    case 'ACTIVE': return styles.statusSent;
    case 'PENDING': return styles.statusDraft;
    default: return styles.statusDraft;
  }
};

export default function ProjectsPage() {
  const { data, loading, error } = useQuery(GET_PROJECTS_QUERY);

  // Define the columns for our Projects table
  const projectColumns = [
    {
      header: 'Project Title',
      accessor: 'title',
      render: (row: any) => (
        <Link href={`/dashboard/projects/${row.id}`} style={{ color: 'var(--link-color)', fontWeight: 'bold' }}>
          {row.title}
        </Link>
      )
    },
    {
      header: 'Client',
      accessor: 'client.name'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: any) => (
        <span className={`${styles.status} ${getStatusClass(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row: any) => (
        <Link href={`/dashboard/projects/${row.id}/edit`}>Edit</Link>
      )
    }
  ];

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
      
      {/* All the old table code is replaced by this one simple component! */}
      <DataTable columns={projectColumns} data={data?.projects} />
    </div>
  );
}