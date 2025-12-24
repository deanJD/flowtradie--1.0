"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";

import { useAuth } from "@/app/context/AuthContext";
import { GET_PROJECTS } from "@/app/lib/graphql/queries/projects";
import { DELETE_PROJECT_MUTATION } from "@/app/lib/graphql/mutations/project";

import Button from "@/components/Button/Button";
import tableStyles from "@/app/dashboard/styles/DashboardTable.module.css";

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Fetch projects
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS, {
    fetchPolicy: "network-only",
  });

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION);

  if (authLoading || loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  const projects = data?.projects ?? [];

  // Confirm delete handler
  async function confirmDelete() {
    if (!deleteTarget) return;

    await deleteProject({
      variables: { id: deleteTarget.id }, // 👈 must match $id in the mutation
    });

    setDeleteTarget(null);
    refetch();
  }

  return (
    <div className={tableStyles.pageContainer}>
      {/* HEADER */}
      <div className={tableStyles.header}>
        <h1 className={tableStyles.title}>Projects</h1>
        <Button href="/dashboard/projects/new">+ New Project</Button>
      </div>

      {/* PROJECTS TABLE */}
      <div className={tableStyles.tableContainer}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Site Address</th>
              <th>Status</th>
              <th className={tableStyles.actionsCell}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p: any) => (
              <tr key={p.id}>
                <td>{p.title}</td>

                <td>
                  {p.client?.firstName} {p.client?.lastName}
                </td>

                <td>
                  {p.siteAddress
                    ? `${p.siteAddress.line1}, ${p.siteAddress.city}${
                        p.siteAddress.state ? " " + p.siteAddress.state : ""
                      } ${p.siteAddress.postcode}`
                    : "—"}
                </td>

                {/* STATUS PILL */}
                <td>
                  <span
                    className={`${tableStyles.status} ${
                      p.status === "ACTIVE"
                        ? tableStyles.statusActive
                        : p.status === "COMPLETED"
                        ? tableStyles.statusCompleted
                        : p.status === "PENDING"
                        ? tableStyles.statusPending
                        : tableStyles.statusDraft
                    }`}
                  >
                    {p.status.toLowerCase()}
                  </span>
                </td>

                {/* ACTION DROPDOWN */}
                <td className={tableStyles.actionsCell}>
                  <div className={tableStyles.dropdown}>
                    <button className={tableStyles.dropdownButton}>Edit</button>

                    <div className={tableStyles.dropdownMenu}>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/projects/${p.id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/dashboard/projects/${p.id}/edit`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className={tableStyles.deleteAction}
                        onClick={() => setDeleteTarget(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {projects.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "1.5rem", textAlign: "center" }}
                >
                  No projects found.
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
            <h3 className={tableStyles.modalTitle}>Delete Project</h3>

            <p className={tableStyles.modalMessage}>
              Are you sure you want to delete project{" "}
              <strong>{deleteTarget.title}</strong>?
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
