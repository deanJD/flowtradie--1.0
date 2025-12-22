"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";

import { useAuth } from "@/app/context/AuthContext";
import { GET_INVOICES_DASHBOARD } from "@/app/lib/graphql/queries/invoices";
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

  const { data, loading, error, refetch } = useQuery(
  GET_INVOICES_DASHBOARD,
  { fetchPolicy: "network-only" }
);


  const [deleteInvoice] = useMutation(DELETE_INVOICE_MUTATION);

  if (authLoading || loading) return <p>Loading invoices...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const invoices = data?.invoices ?? [];

  function formatAmount(value: any) {
    if (value == null) return "—";
    const num = typeof value === "number"
      ? value
      : parseFloat(String(value) || "0");
    return Number.isNaN(num) ? "—" : num.toFixed(2);
  }

  function formatDate(value: any) {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    
    await deleteInvoice({
      variables: { id: deleteTarget.id }
    });

    setDeleteTarget(null);
    refetch();
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Invoices</h1>
        <Button href="/dashboard/invoices/new">+ Create Invoice</Button>
      </div>

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
                <td>{inv.status}</td>
                <td>${formatAmount(inv.totalAmount)}</td>
                <td>{formatDate(inv.dueDate)}</td>

                <td className={styles.actionsCell}>
                  <button onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}>View</button>
                  <button onClick={() => setDeleteTarget(inv)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <p className={styles.emptyMessage}>No invoices found yet.</p>
        )}
      </div>
    </div>
  );
}
