// client/app/dashboard/clients/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CLIENTS_QUERY } from '@/app/lib/graphql/queries/clients';
import Link from 'next/link';
import DataTable from '@/components/DataTable/DataTable';
import ListPageLayout from '@/components/ListPageLayout/ListPageLayout';
import tableStyles from '@/components/DataTable/DataTable.module.css';

export default function ClientsPage() {
  const { data, loading, error } = useQuery(GET_CLIENTS_QUERY);

  // Define the "blueprint" for our Clients table
  const clientColumns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row: any) => (
        <Link href={`/dashboard/clients/${row.id}`} className={tableStyles.tableLink}>
          {row.name}
        </Link>
      )
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (row: any) => row.phone || 'N/A' // Handle cases where phone is null
    },
    {
      header: 'Actions',
      accessor: 'id',
      className: tableStyles.actionsCell, // Apply our right-alignment class
      render: (row: any) => (
        <Link href={`/dashboard/clients/${row.id}/edit`} className={tableStyles.tableLink}>
          Edit
        </Link>
      )
    }
  ];

  if (loading) return <p>Loading clients...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ListPageLayout
      title="Clients"
      newButtonText="+ New Client"
      newButtonLink="/dashboard/clients/new"
    >
      <DataTable columns={clientColumns} data={data?.clients} />
    </ListPageLayout>
  );
}