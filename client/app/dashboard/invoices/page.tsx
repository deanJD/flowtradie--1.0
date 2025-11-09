'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';

import { GET_INVOICES_QUERY } from '@/app/lib/graphql/queries/invoices';
import { DELETE_INVOICE_MUTATION } from '@/app/lib/graphql/mutations/invoice';

import DataTable from '@/components/DataTable/DataTable';
import ListPageLayout from '@/components/ListPageLayout/ListPageLayout';
import tableStyles from '@/components/DataTable/DataTable.module.css';
import DeleteConfirmModal from "@/components/DeleteConfirmModal/DeleteConfirmModal";

// --- STATUS STYLES ---
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

  // ✅ Queries & Mutations
  const { data, loading, error } = useQuery(GET_INVOICES_QUERY);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; number: string } | null>(null);

  const [deleteInvoice] = useMutation(DELETE_INVOICE_MUTATION);


  // ✅ SAFE CONFIRM DELETE HANDLER
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteInvoice({
        variables: { deleteInvoiceId: deleteTarget.id },
        update(cache) {
          cache.modify({
            fields: {
              invoices(existing = [], { readField }) {
                return existing.filter(
                  (invoiceRef: any) => readField("id", invoiceRef) !== deleteTarget.id
                );
              },
            },
          });
        },
      });

      // ✅ ✅ ✅ THIS FIXES THE MODAL NOT CLOSING
      setShowDeleteModal(false);
      setDeleteTarget(null);

    } catch (err) {
      console.error(err);
    }
  };


  // ✅ Table Columns
  const invoiceColumns = [
    {
      header: 'Invoice #',
      accessor: 'invoiceNumber',
      render: (row: any) => (
        <Link href={`/dashboard/invoices/${row.id}/preview`} className={tableStyles.tableLink}>
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
        <div className={tableStyles.dropdown}>
          <button className={tableStyles.dropdownButton}>Actions ▾</button>

          <div className={tableStyles.dropdownMenu}>
            <Link href={`/dashboard/invoices/${row.id}/preview`}>Preview</Link>
            <Link href={`/dashboard/invoices/${row.id}/edit`}>Edit</Link>

            <button
              className={tableStyles.deleteBtn}
              onClick={() => {
                setDeleteTarget({ id: row.id, number: row.invoiceNumber });
                setShowDeleteModal(true);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];


  // ✅ Loading / Error States
  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>Error: {error.message}</p>;


  // ✅ Page Render
  return (
    <>
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        invoiceNumber={deleteTarget?.number}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />

      <ListPageLayout
        title="Invoices"
        newButtonText="+ New Invoice"
        newButtonLink="/dashboard/invoices/new"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>All Invoices</h2>
          <Link href="/dashboard/settings" className="settingsButton">⚙️ Settings</Link>
        </div>

        <DataTable columns={invoiceColumns} data={data?.invoices ?? []} />
      </ListPageLayout>
    </>
  );
}
