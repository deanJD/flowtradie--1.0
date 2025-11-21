'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_CLIENT_MUTATION } from '@/app/lib/graphql/mutations/client';
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';
import styles from './NewClientPage.module.css';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';

export default function NewClientPage() {
  const router = useRouter();

  // -------------------------
  // NEW structured address fields
  // -------------------------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateField] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');

  const [createClient, { loading, error }] = useMutation(CREATE_CLIENT_MUTATION, {
    update(cache, { data: { createClient: newClient } }) {
      const existing = cache.readQuery<{ clients: any[] }>({ query: GET_CLIENTS_QUERY });

      if (existing?.clients) {
        cache.writeQuery({
          query: GET_CLIENTS_QUERY,
          data: { clients: [newClient, ...existing.clients] },
        });
      }
    },
    onCompleted: () => router.push('/dashboard/clients'),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    createClient({
      variables: {
        input: {
          name,
          email,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          postcode,
          country,
        },
      },
    });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create a New Client</h1>

        <Input label="Client Name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

        <Input label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <Input label="Phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <h3 className={styles.subTitle}>Client Address</h3>

        <Input label="Address Line 1" id="addressLine1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />

        <Input label="Address Line 2" id="addressLine2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />

        <Input label="Postcode" id="postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} />


        <Input label="City" id="city" value={city} onChange={(e) => setCity(e.target.value)} />

        <Input label="State" id="state" value={state} onChange={(e) => setStateField(e.target.value)} />

        
        <Input label="Country" id="country" value={country} onChange={(e) => setCountry(e.target.value)} />

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
