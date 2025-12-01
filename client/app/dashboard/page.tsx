'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects';
import { GET_DASHBOARD_SUMMARY } from '@/app/lib/graphql/queries/dashboard'; 
import styles from './Dashboard.module.css';
import StatCard from '@/components/StatCard/StatCard';
import Button from '@/components/Button/Button';

type Project = {
  id: string;
  title: string;
  status: string;
  client?: { name?: string | null } | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 🚨 Redirect if no user
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  /* -------------------------
     1. FETCH PROJECTS
  ------------------------- */
  const {
    data: projectsData,
    loading: loadingProjects,
    error: errorProjects,
  } = useQuery(GET_PROJECTS_QUERY, {
    variables: { businessId: user?.businessId ?? "" }, // 👈 IMPORTANT!
    skip: authLoading || !user?.businessId,
    fetchPolicy: 'network-only', // 💡 Prevent stale data on next.js re-render
  });

  /* -------------------------
     2. FETCH DASHBOARD STATS
  ------------------------- */
  const {
    data: summaryData,
    loading: loadingSummary,
    error: errorSummary,
  } = useQuery(GET_DASHBOARD_SUMMARY, {
    skip: authLoading || !user?.businessId,
    fetchPolicy: 'network-only', // ⚡ always fresh!
  });

  if (authLoading || loadingProjects || loadingSummary) {
    return <p>Loading Dashboard...</p>;
  }

  if (!user) return null;

  if (errorProjects || errorSummary) {
    return (
      <p>Error: {errorProjects?.message ?? errorSummary?.message}</p>
    );
  }

  /* -------------------------
     FORMAT DATA
  ------------------------- */
  const projects: Project[] = projectsData?.projects ?? [];

  const {
    totalOpenProjects = 0,
    invoicesDueSoon = 0,
    tasksDueToday = 0,
    totalRevenueYTD = 0,
  } = summaryData?.getDashboardSummary || {};

  /* -------------------------
     RENDER UI
  ------------------------- */
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.welcomeMessage}>Welcome, {user.name}!</h1>
        <Button href="/dashboard/projects/new">+ Create New Project</Button>
      </div>

      <p className={styles.roleInfo}>Your role is: {user.role}</p>

      {/* 🔥 Stats Cards */}
      <div className={styles.statsGrid}>
        <StatCard title="Active Projects" value={totalOpenProjects} />
        <StatCard title="Invoices Due Soon" value={invoicesDueSoon} />
        <StatCard title="Tasks Due Today" value={tasksDueToday} />
        <StatCard
          title="Revenue (YTD)"
          value={`$${totalRevenueYTD.toLocaleString()}`}
        />
      </div>

      {/* 🔥 Projects List */}
      <div className={styles.detailsBox}>
        <h3 className={styles.detailsTitle}>Your Projects</h3>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <strong>{project.title}</strong> ({project.status}) - for{' '}
                  {project.client?.name ?? 'No client'}
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
