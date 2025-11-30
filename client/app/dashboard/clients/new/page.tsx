'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/app/context/AuthContext';
import { CREATE_CLIENT_MUTATION } from '@/app/lib/graphql/mutations/client';
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';

import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import styles from './NewClientPage.module.css';

export default function NewClientPage() {
  const { user } = useAuth();
  const router = useRouter();

  // --- Form State ---
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    type: 'RESIDENTIAL',

    // --- Address Form ---
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia', // default 🇦🇺
  });

  const set = (k: string) => (e: any) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // --- GraphQL Mutation Setup ---
  const [createClient, { loading }] = useMutation(CREATE_CLIENT_MUTATION, {
    refetchQueries: [
      { query: GET_CLIENTS_QUERY, variables: { businessId: user?.businessId } },
    ],
    awaitRefetchQueries: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.businessId) return alert('No business ID found!');

    try {
      await createClient({
        variables: {
          input: {
            businessId: user.businessId,
            firstName: form.firstName,
            lastName: form.lastName,
            businessName: form.businessName,
            email: form.email,
            phone: form.phone,
            type: form.type,

            addresses: [
              {
                line1: form.line1,
                line2: form.line2,
                city: form.city,
                state: form.state,
                postcode: form.postcode,
                country: form.country,
              }
            ],
          },
        },
      });

      router.push('/dashboard/clients');
    } catch (err) {
      console.error(err);
      alert('Failed to create client.');
    }
  };

  // --- Render Form ---
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Add New Client</h1>

        {/* --- Basic Info --- */}
        <Input label="First Name" value={form.firstName} onChange={set('firstName')} required />
        <Input label="Last Name" value={form.lastName} onChange={set('lastName')} required />
        <Input label="Business Name" value={form.businessName} onChange={set('businessName')} />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} />
        <Input label="Phone" value={form.phone} onChange={set('phone')} />

        {/* --- Address Section --- */}
        <h2 className={styles.subtitle}>Address</h2>
        <Input label="Address Line 1" value={form.line1} onChange={set('line1')} required />
        <Input label="Address Line 2" value={form.line2} onChange={set('line2')} />
        <Input label="City" value={form.city} onChange={set('city')} required />
        <Input label="State" value={form.state} onChange={set('state')} />
        <Input label="Postcode" value={form.postcode} onChange={set('postcode')} required />
        <Input label="Country" value={form.country} onChange={set('country')} />

        {/* --- Client Type --- */}
        <select className={styles.select} value={form.type} onChange={set('type')}>
          <option value="RESIDENTIAL">Residential</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>

        {/* --- Buttons --- */}
        <div className={styles.buttonGroup}>
          <Button href="/dashboard/clients" variant="secondary" type="button">Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save Client'}
          </Button>
        </div>
      </form>
    </div>
  );
}
