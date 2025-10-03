// client/app/dashboard/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // This useEffect hook is our "gatekeeper".
  // It runs after the component mounts and whenever the user, loading, or router state changes.
  useEffect(() => {
    // We wait until the initial authentication check is complete.
    if (!loading && !user) {
      // If the check is done and there is no user, redirect to the login page.
      router.push('/login');
    }
  }, [user, loading, router]); // The dependencies for the hook

  // While the auth state is loading, or if we are about to redirect,
  // show a simple loading message to prevent a flash of the real content.
  if (loading || !user) {
    return <p>Loading...</p>;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // If we get to this point, it means loading is false AND we have a user.
  // So, it's safe to render the dashboard.
  return (
    <div className={styles.container}>
      <h1 className={styles.welcomeMessage}>Welcome, {user.name}!</h1>
      <p className={styles.roleInfo}>You are successfully logged in. Your role is: {user.role}</p>
      
      <button 
        onClick={handleLogout} 
        className={styles.logoutButton}
      >
        Logout
      </button>

      <div className={styles.detailsBox}>
        <h3 className={styles.detailsTitle}>Your Details:</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}