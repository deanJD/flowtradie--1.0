"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";

import { useAuth } from "@/app/context/AuthContext";
import { GET_INVOICES } from "@/app/lib/graphql/queries/invoices";
import { DELETE_INVOICE_MUTATION } from "@/app/lib/graphql/mutations/invoice";

import Button from "@/components/Button/Button";
import styles from "@/app/dashboard/styles/DashboardTable.module.css";


export default function InvoicesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  const { data, loading, error, refetch } = useQuery(GET_INVOICES, {
    variables: { businessId: user?.businessId },
    skip: !user?.businessId,
    fetchPolicy: "network-only",
  });

  const [deleteInvoice] = useMutation(DELETE_INVOICE_MUTATION);

  if (authLoading || loading) return <p>Loading invoices...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const invoices = data?.invoices ?? [];

  function renderStatus(status: string) {
    const normalized = status.toUpperCase();
    let cls = "";

    switch (normalized) {
      case "PAID":
        cls = tableStyles.statusPaid;
        break;
      case "SENT":
        cls = tableStyles.statusSent;
        break;
      case "OVERDUE":
        cls = tableStyles.statusOverdue;
        break;
      case "PARTIALLY_PAID":
        cls = tableStyles.statusPartially;
        break;
      case "DRAFT":
      default:
        cls = tableStyles.statusDraft;
        break;
    }

    return (
      <span className={`${tableStyles.status} ${cls}`}>
        {normalized.toLowerCase()}
      </span>
    );
  }

  function formatAmount(value: any) {
    if (value == null) return "—";
    const num =
      typeof value === "number" ? value : parseFloat(String(value) || "0");
    if (Number.isNaN(num)) return "—";
    return num.toFixed(2);
  }

  function formatDate(value: any) {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteInvoice({ variables: { id: deleteTarget.id } });
    setDeleteTarget(null);
    refetch();
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Invoices</h1>
        <Button href="/dashboard/invoices/new">+ Create Invoice</Button>
      </div>

      {/* Table */}
      <div className={tableStyles.tableContainer}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Status</th>
              <th>Total</th>
              <th>Due Date</th>
              <th className={tableStyles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv: any) => (
              <tr key={inv.id}>
                <td>{inv.invoiceNumber}</td>
                <td>
                  {inv.client
                    ? `${inv.client.firstName} ${inv.client.lastName}`
                    : "—"}
                </td>
                <td>{renderStatus(inv.status)}</td>
                <td>${formatAmount(inv.totalAmount)}</td>
                <td>{formatDate(inv.dueDate)}</td>

                <td className={tableStyles.actionsCell}>
                  <div className={tableStyles.dropdown}>
                    <button className={tableStyles.dropdownButton}>⋮</button>

                    <div className={tableStyles.dropdownMenu}>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/invoices/${inv.id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/dashboard/invoices/${inv.id}/edit`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className={tableStyles.deleteBtn}
                        onClick={() => setDeleteTarget(inv)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <p className={tableStyles.emptyMessage}>No invoices found yet.</p>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Delete Invoice</h3>
            <p>
              Are you sure you want to delete invoice{" "}
              <strong>{deleteTarget.invoiceNumber}</strong>?
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className={styles.deleteBtn}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
