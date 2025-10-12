// client/app/dashboard/clients/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_CLIENT_MUTATION } from '@/app/lib/graphql/mutations/client';
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';
import styles from './NewClientPage.module.css';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input'; // <-- 1. Import our new Input component

export default function NewClientPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [createClient, { loading, error }] = useMutation(CREATE_CLIENT_MUTATION, {
    update(cache, { data: { createClient: newClient } }) {
      const data = cache.readQuery<{ clients: any[] }>({ query: GET_CLIENTS_QUERY });
      if (data && newClient) {
        cache.writeQuery({
          query: GET_CLIENTS_QUERY,
          data: { clients: [newClient, ...data.clients] },
        });
      }
    },
    onCompleted: () => router.push('/dashboard/clients'),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createClient({
      variables: {
        input: { name, email, phone, address },
      },
    });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create a New Client</h1>

        {/* 2. Replace the old input blocks with our new component */}
        <Input
          label="Client Name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Phone (Optional)"
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Note: The textarea is still custom for now. We can build a reusable <Textarea> component next! */}
        <div className={styles.inputGroup}>
          <label htmlFor="address" className={styles.label}>Address (Optional)</label>
          <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className={styles.input} rows={4} />
        </div>

        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

        <div className={styles.buttonGroup}>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Client'}
          </Button>
          <Button href="/dashboard/clients" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}