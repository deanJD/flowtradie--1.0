// client/app/dashboard/invoices/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_INVOICES_QUERY } from '@/app/lib/graphql/queries/invoices';
import Link from 'next/link';
import DataTable from '@/components/DataTable/DataTable';
import ListPageLayout from '@/components/ListPageLayout/ListPageLayout';
import tableStyles from '@/components/DataTable/DataTable.module.css';

const getStatusClass = (status: string) => {
  switch (status) {
    case 'PAID': return tableStyles.statusPaid;
    case 'SENT': return tableStyles.statusSent;
    case 'DRAFT': return tableStyles.statusDraft;
    default: return tableStyles.statusDraft;
  }
};

export default function InvoicesPage() {
  const { data, loading, error } = useQuery(GET_INVOICES_QUERY);

  const invoiceColumns = [
    {
      header: 'Invoice #',
      accessor: 'invoiceNumber',
      render: (row: any) => (
        <Link href={`/dashboard/invoices/${row.id}`} className={tableStyles.tableLink}>
          {row.invoiceNumber}
        </Link>
      )
    },
    {
      header: 'Client',
      accessor: 'project.client.name'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: any) => (
        <span className={`${tableStyles.status} ${getStatusClass(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Total',
      accessor: 'totalAmount',
      render: (row: any) => `$${row.totalAmount.toFixed(2)}`
    },
    {
      header: 'Actions',
      accessor: 'id',
      // vvvvvvvvvvvv THIS IS THE FIX vvvvvvvvvvvv
      render: (row: any) => (
        <Link href={`/dashboard/invoices/${row.id}`} className={tableStyles.tableLink}>
          View/Edit
        </Link>
      )
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }
  ];

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ListPageLayout
      title="Invoices"
      newButtonText="+ New Invoice"
      newButtonLink="/dashboard/invoices/new"
    >
      <DataTable columns={invoiceColumns} data={data?.invoices} />
    </ListPageLayout>
  );
}