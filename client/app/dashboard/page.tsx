// client/app/dashboard/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_JOBS_QUERY } from '../lib/graphql/queries/jobs';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const { data, loading: jobsLoading, error } = useQuery(GET_JOBS_QUERY);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || jobsLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching jobs: {error.message}</p>;
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className={styles.welcomeMessage}>Welcome, {user?.name}!</h1>
        <Link href="/dashboard/jobs/new" className={styles.logoutButton} style={{ backgroundColor: 'var(--primary-accent)', color: 'white' }}>
          + Create New Job
        </Link>
      </div>
      <p className={styles.roleInfo}>You are successfully logged in. Your role is: {user?.role}</p>
      
      <button 
        onClick={handleLogout} 
        className={styles.logoutButton}
      >
        Logout
      </button>

      <div className={styles.detailsBox}>
        <h3 className={styles.detailsTitle}>Your Jobs</h3>
        {data && data.jobs && data.jobs.length > 0 ? (
          <ul>
            {data.jobs.map((job: any) => (
              <li key={job.id}>
                <Link href={`/dashboard/jobs/${job.id}`}>
                  <strong>{job.title}</strong> ({job.status}) - for {job.customer.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
    </div>
  );
}