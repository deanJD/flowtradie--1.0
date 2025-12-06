// client/app/dashboard/clients/[clientId]/edit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';

import { GET_CLIENT_QUERY } from '@/app/lib/graphql/queries/client';
import { GET_CLIENTS } from '@/app/lib/graphql/queries/clients';
import { UPDATE_CLIENT_MUTATION } from '@/app/lib/graphql/mutations/client';

import styles from './EditClientPage.module.css';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.clientId as string;

  // --- Load Client Data ---
  const { data, loading, error } = useQuery(GET_CLIENT_QUERY, {
    variables: { id: clientId },
  });

  // --- State ---
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [updateClient, { loading: saving }] = useMutation(UPDATE_CLIENT_MUTATION, {
    refetchQueries: [{ query: GET_CLIENTS }],
    awaitRefetchQueries: true,
  });

  // --- Populate Form When Loaded ---
  useEffect(() => {
    if (data?.client) {
      const c = data.client;
      setForm({
        firstName: c.firstName ?? '',
        lastName: c.lastName ?? '',
        businessName: c.businessName ?? '',
        email: c.email ?? '',
        phone: c.phone ?? '',
        notes: c.notes ?? '',
      });
    }
  }, [data]);

  // --- Change Handler ---
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateClient({
        variables: {
          id: clientId,               // 👈 must match mutation definition
          input: { ...form },         // 👈 matches UpdateClientInput
        },
      });

      router.push(`/dashboard/clients/${clientId}`);
    } catch (err) {
      console.error('Update client error:', err);
      alert('Failed to update client.');
    }
  };

  // --- Loading / Error ---
  if (loading) return <p>Loading client...</p>;
  if (error) return <p>Error loading client: {error.message}</p>;

  // --- Render ---
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Edit Client</h1>

        <Input
          label="First Name"
          id="firstName"
          type="text"
          value={form.firstName}
          onChange={set('firstName')}
          required
        />
        <Input
          label="Last Name"
          id="lastName"
          type="text"
          value={form.lastName}
          onChange={set('lastName')}
          required
        />
        <Input
          label="Business Name"
          id="businessName"
          type="text"
          value={form.businessName}
          onChange={set('businessName')}
        />
        <Input
          label="Email"
          id="email"
          type="email"
          value={form.email}
          onChange={set('email')}
        />
        <Input
          label="Phone"
          id="phone"
          type="text"
          value={form.phone}
          onChange={set('phone')}
        />

        {/* If your Input supports textarea mode, or replace this with a <textarea> */}
        <Input
          label="Notes"
          id="notes"
          type="text"
          value={form.notes}
          onChange={set('notes')}
        />

        <div className={styles.buttonGroup}>
          <Button href={`/dashboard/clients/${clientId}`} variant="secondary" type="button">
            Cancel
          </Button>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Client'}
          </Button>
        </div>
      </form>
    </div>
  );
}
