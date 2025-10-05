// client/app/dashboard/jobs/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMERS_QUERY } from '@/app/lib/graphql/queries/customers';
import Link from 'next/link';
import styles from './NewJobPage.module.css';

export default function NewJobPage() {
  // Fetch customers for the dropdown
  const { data: customersData, loading: customersLoading, error: customersError } = useQuery(GET_CUSTOMERS_QUERY);

  // State for the form fields
  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Creating job with:', { title, customerId, description });
    // We'll add the createJob mutation logic here next
  };

  if (customersLoading) return <p>Loading customers...</p>;
  if (customersError) return <p>Error loading customers: {customersError.message}</p>;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create a New Job</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="title" className={styles.label}>Job Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="customer" className={styles.label}>Customer</label>
          <select
            id="customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className={styles.input}
            required
          >
            <option value="" disabled>Select a customer</option>
            {customersData?.customers.map((customer: any) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description" className={styles.label}>Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            rows={4}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className={styles.button}>
            Create Job
          </button>
          <Link href="/dashboard" className={styles.button} style={{ backgroundColor: '#ccc', textAlign: 'center' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}