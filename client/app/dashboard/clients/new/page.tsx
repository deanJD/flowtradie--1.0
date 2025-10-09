// client/app/dashboard/clients/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_CLIENT_MUTATION } from '@/app/lib/graphql/mutations/client';
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients'; // <-- 1. Import the query
import Link from 'next/link';
import styles from './NewClientPage.module.css';

export default function NewClientPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [createClient, { loading, error }] = useMutation(CREATE_CLIENT_MUTATION, {
    onCompleted: () => {
      router.push('/dashboard/clients');
    },
    // 2. This is the fix: tells Apollo to refetch the list of clients
    refetchQueries: [{ query: GET_CLIENTS_QUERY }],
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createClient({
      variables: {
        input: {
          name,
          email,
          phone,
          address,
        },
      },
    });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create a New Client</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Client Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>Phone (Optional)</label>
          <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="address" className={styles.label}>Address (Optional)</label>
          <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className={styles.input} rows={4} />
        </div>

        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating...' : 'Create Client'}
          </button>
          <Link href="/dashboard/clients" className={styles.button} style={{ backgroundColor: '#ccc', textAlign: 'center' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}