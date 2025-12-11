"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";

import { useAuth } from "@/app/context/AuthContext";
import { GET_INVOICES } from "@/app/lib/graphql/queries/invoices";
import { DELETE_INVOICE_MUTATION } from "@/app/lib/graphql/mutations/invoice";

import Button from "@/components/Button/Button";
// ✅ FIX: Import the shared table styles as 'styles'
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
        cls = styles.statusPaid;
        break;
      case "SENT":
        cls = styles.statusSent;
        break;
      case "OVERDUE":
        cls = styles.statusOverdue;
        break;
      case "PARTIALLY_PAID":
        cls = styles.statusPartially;
        break;
      case "DRAFT":
      default:
        cls = styles.statusDraft;
        break;
    }

    return (
      <span className={`${styles.status} ${cls}`}>
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
    // ✅ FIX: Variable name must match the Mutation ($deleteInvoiceId)
    await deleteInvoice({ variables: { deleteInvoiceId: deleteTarget.id } });
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
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Status</th>
              <th>Total</th>
              <th>Due Date</th>
              <th className={styles.actionsHeader}>Actions</th>
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

                <td className={styles.actionsCell}>
                  <div className={styles.dropdown}>
                    <button className={styles.dropdownButton}>⋮</button>

                    <div className={styles.dropdownMenu}>
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

                      {/* ✅ NEW: PDF Download Button */}
                      <button
                        onClick={() =>
                          window.open(`/api/invoices/${inv.id}/pdf`, '_blank')
                        }
                      >
                        Download PDF
                      </button>

                      <button
                        className={styles.deleteBtn}
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
          <p className={styles.emptyMessage}>No invoices found yet.</p>
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