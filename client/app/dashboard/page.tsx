// client/app/dashboard/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS_QUERY } from '../lib/graphql/queries/projects';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const { data, loading: projectsLoading, error } = useQuery(GET_PROJECTS_QUERY);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || projectsLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching projects: {error.message}</p>;
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className={styles.welcomeMessage}>Welcome, {user?.name}!</h1>
        <Link href="/dashboard/projects/new" className={styles.logoutButton} style={{ backgroundColor: 'var(--primary-accent)', color: 'white' }}>
          + Create New Project
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
        <h3 className={styles.detailsTitle}>Your Projects</h3>
        {data && data.projects && data.projects.length > 0 ? (
          <ul>
            {data.projects.map((project: any) => (
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