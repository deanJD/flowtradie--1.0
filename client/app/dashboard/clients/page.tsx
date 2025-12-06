"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";

import { useAuth } from "@/app/context/AuthContext";
import { GET_CLIENTS } from "@/app/lib/graphql/queries/clients";
import { DELETE_CLIENT_MUTATION } from "@/app/lib/graphql/mutations/client";

import Button from "@/components/Button/Button";
import tableStyles from "@/app/dashboard/styles/DashboardTable.module.css";

export default function ClientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Fetch clients
  const { data, loading, error, refetch } = useQuery(GET_CLIENTS, {
    variables: { businessId: user?.businessId },
    skip: !user?.businessId,
    fetchPolicy: "network-only",
  });

  const [deleteClient] = useMutation(DELETE_CLIENT_MUTATION);

  if (authLoading || loading) return <p>Loading clients...</p>;
  if (error) return <p>Error loading clients: {error.message}</p>;

  const clients = data?.clients ?? [];

  // Delete handler
  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteClient({ variables: { id: deleteTarget.id } });
    setDeleteTarget(null);
    refetch();
  }

  return (
    <div className={tableStyles.pageContainer}>
      {/* HEADER */}
      <div className={tableStyles.header}>
        <h1 className={tableStyles.title}>Clients</h1>
        <Button href="/dashboard/clients/new">+ Add Client</Button>
      </div>

      {/* TABLE */}
      <div className={tableStyles.tableContainer}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Business</th>
              <th className={tableStyles.actionsCell}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((c: any) => (
              <tr key={c.id}>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.email || "—"}</td>
                <td>{c.phone || "—"}</td>
                <td>{c.businessName || "—"}</td>

                {/* ACTION MENU */}
                <td className={tableStyles.actionsCell}>
                  <div className={tableStyles.dropdown}>
                    <button className={tableStyles.dropdownButton}>•••</button>

                    <div className={tableStyles.dropdownMenu}>
                      <button onClick={() => router.push(`/dashboard/clients/${c.id}`)}>
                        View
                      </button>

                      <button onClick={() => router.push(`/dashboard/clients/${c.id}/edit`)}>
                        Edit
                      </button>

                      <button
                        className={tableStyles.deleteAction}
                        onClick={() => setDeleteTarget(c)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {clients.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "1.5rem", textAlign: "center" }}>
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className={tableStyles.modalOverlay}>
          <div className={tableStyles.modal}>
            <h3 className={tableStyles.modalTitle}>Delete Client</h3>

            <p className={tableStyles.modalMessage}>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>?
            </p>

            <div className={tableStyles.modalActions}>
              <button
                className={tableStyles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                className={tableStyles.deleteBtn}
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
