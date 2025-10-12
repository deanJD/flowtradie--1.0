// client/app/dashboard/clients/[clientId]/edit/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_CLIENT_QUERY } from '@/app/lib/graphql/queries/client';
import { UPDATE_CLIENT_MUTATION } from '@/app/lib/graphql/mutations/client';
import styles from './EditClientPage.module.css';
import Button from '@/components/Button/Button';

export default function EditClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const router = useRouter();

  const { data: clientData, loading: clientLoading } = useQuery(GET_CLIENT_QUERY, {
    variables: { clientId },
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (clientData && clientData.client) {
      const { client } = clientData;
      setName(client.name);
      setEmail(client.email);
      setPhone(client.phone || '');
      setAddress(client.address || '');
    }
  }, [clientData]);

  const [updateClient, { loading: updatingClient, error: updateError }] = useMutation(UPDATE_CLIENT_MUTATION, {
    onCompleted: () => {
      router.push(`/dashboard/clients/${clientId}`);
    },
    refetchQueries: [{ query: GET_CLIENT_QUERY, variables: { clientId } }, 'GetClients'],
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateClient({
      variables: {
        updateClientId: clientId,
        input: {
          name,
          email,
          phone,
          address,
        },
      },
    });
  };

  if (clientLoading) return <p>Loading client for editing...</p>;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Edit Client</h1>

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

        {updateError && <p style={{ color: 'red' }}>Error: {updateError.message}</p>}

        <div className={styles.buttonGroup}>
          <Button type="submit" disabled={updatingClient}>
            {updatingClient ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button href={`/dashboard/clients/${clientId}`} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}