// client/app/dashboard/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext'; // <-- Using path alias
import { useQuery } from '@apollo/client';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects'; // <-- Using path alias
import { GET_DASHBOARD_SUMMARY_QUERY } from '@/app/lib/graphql/queries/dashboard'; // <-- Using path alias
import styles from './Dashboard.module.css';
import StatCard from '@/components/StatCard/StatCard'; // <-- Using path alias

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Fetch the list of projects
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery(GET_PROJECTS_QUERY);
  // Fetch the dashboard summary data
  const { data: summaryData, loading: summaryLoading, error: summaryError } = useQuery(GET_DASHBOARD_SUMMARY_QUERY);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isLoading = authLoading || projectsLoading || summaryLoading;
  const fetchError = projectsError || summaryError;

  if (isLoading) return <p>Loading Dashboard...</p>;
  if (fetchError) return <p>Error loading dashboard: {fetchError.message}</p>;

  const summary = summaryData?.getDashboardSummary;

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className={styles.welcomeMessage}>Welcome, {user?.name}!</h1>
        <Link href="/dashboard/projects/new" className={styles.logoutButton} style={{ backgroundColor: 'var(--primary-accent)', color: 'white' }}>
          + Create New Project
        </Link>
      </div>
      <p className={styles.roleInfo}>You are successfully logged in. Your role is: {user?.role}</p>
      
      <div className={styles.statsGrid}>
        <StatCard title="Active Projects" value={summary?.totalOpenProjects ?? 0} />
        <StatCard title="Invoices Due Soon" value={summary?.invoicesDueSoon ?? 0} />
        <StatCard title="Tasks Due Today" value={summary?.tasksDueToday ?? 0} />
        <StatCard title="Revenue (YTD)" value={`$${(summary?.totalRevenueYTD ?? 0).toLocaleString()}`} />
      </div>

      <div className={styles.detailsBox}>
        <h3 className={styles.detailsTitle}>Your Projects</h3>
        {projectsData && projectsData.projects && projectsData.projects.length > 0 ? (
          <ul>
            {projectsData.projects.map((project: any) => (
              <li key={project.id}>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <strong>{project.title}</strong> ({project.status}) - for {project.client.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
}