'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';

import { GET_CLIENT_QUERY } from '@/app/lib/graphql/queries/client';
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';
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
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  });

  const [updateClient, { loading: saving }] = useMutation(UPDATE_CLIENT_MUTATION, {
    refetchQueries: [{ query: GET_CLIENTS_QUERY }],
    awaitRefetchQueries: true,
  });

  // --- Populate Form When Loaded ---
  useEffect(() => {
    if (data?.client) {
      const c = data.client;
      setForm({
        name: c.name ?? '',
        email: c.email ?? '',
        phone: c.phone ?? '',
        addressLine1: c.addressLine1 ?? '',
        addressLine2: c.addressLine2 ?? '',
        city: c.city ?? '',
        state: c.state ?? '',
        postcode: c.postcode ?? '',
        country: c.country ?? '',
      });
    }
  }, [data]);

  // --- Change Handler ---
  const set = (key: string) => (e: any) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateClient({
        variables: {
          updateClientId: clientId,
          input: { ...form },
        },
      });

      router.push('/dashboard/clients');
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

        <Input label="Client Name" id="name" type="text" value={form.name} onChange={set("name")} required />
        <Input label="Email" id="email" type="email" value={form.email} onChange={set("email")} required />
        <Input label="Phone" id="phone" type="text" value={form.phone} onChange={set("phone")} />

        <Input label="Address Line 1" id="addressLine1" type="text" value={form.addressLine1} onChange={set("addressLine1")} />
        <Input label="Address Line 2" id="addressLine2" type="text" value={form.addressLine2} onChange={set("addressLine2")} />
        <Input label="City" id="city" type="text" value={form.city} onChange={set("city")} />
        <Input label="State" id="state" type="text" value={form.state} onChange={set("state")} />
        <Input label="Postcode" id="postcode" type="text" value={form.postcode} onChange={set("postcode")} />
        <Input label="Country" id="country" type="text" value={form.country} onChange={set("country")} />

        <div className={styles.buttonGroup}>
          <Button href="/dashboard/clients" variant="secondary" type="button">
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
