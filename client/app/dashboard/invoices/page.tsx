'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_INVOICES_QUERY } from '@/app/lib/graphql/queries/invoices';
import Link from 'next/link';
import DataTable from '@/components/DataTable/DataTable';
import ListPageLayout from '@/components/ListPageLayout/ListPageLayout';
import tableStyles from '@/components/DataTable/DataTable.module.css';

// Helper: map status → style
const getStatusClass = (status: string) => {
  switch (status) {
    case 'PAID': return tableStyles.statusPaid;
    case 'SENT': return tableStyles.statusSent;
    case 'ACTIVE': return tableStyles.statusActive;
    case 'DRAFT': return tableStyles.statusDraft;
    case 'PENDING': return tableStyles.statusPending;
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
        <Link
          href={`/dashboard/invoices/${row.id}/preview`}
          className={tableStyles.tableLink}
        >
          {row.invoiceNumber}
        </Link>
      ),
    },
    {
      header: 'Client',
      accessor: 'project.client.name',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: any) => (
        <span className={`${tableStyles.status} ${getStatusClass(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Total',
      accessor: 'totalAmount',
      render: (row: any) => `$${row.totalAmount.toFixed(2)}`,
    },
    {
      header: 'Actions',
      accessor: 'id',
      className: tableStyles.actionsCell,
      render: (row: any) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            href={`/dashboard/invoices/${row.id}/preview`}
            className={tableStyles.tableLink}
          >
            Preview
          </Link>
          <Link
            href={`/dashboard/invoices/${row.id}/edit`}
            className={tableStyles.tableLink}
          >
            Edit
          </Link>
        </div>
      ),
    },
  ];

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ListPageLayout
      title="Invoices"
      newButtonText="+ New Invoice"
      newButtonLink="/dashboard/invoices/new"
    >
      {/* Toolbar Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <h2 style={{ fontWeight: 600, margin: 0 }}>All Invoices</h2>

       <Link href="/dashboard/settings" className="settingsButton"> 
  ⚙️ Settings
</Link>
      </div>

      <DataTable columns={invoiceColumns} data={data?.invoices ?? []} />
    </ListPageLayout>
  );
}
