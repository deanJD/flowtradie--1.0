"use client";

import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";

import { GET_PROJECT } from "@/app/lib/graphql/queries/project";
import { UPDATE_TASK_MUTATION } from "@/app/lib/graphql/mutations/task";

import styles from "./ProjectDetailsPage.module.css";

export default function ProjectDetailsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
    skip: !projectId, // ✅ don't send query until we have an id
  });

  const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
    onCompleted: () => refetch(),
  });

  const handleToggleTask = (task: any) => {
    updateTask({
      variables: {
        updateTaskId: task.id,
        input: {
          isCompleted: !task.isCompleted,
        },
      },
    });
  };

  if (!projectId) return <p>Invalid project id.</p>;
  if (loading) return <p>Loading project details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.project) return <p>Project not found.</p>;

  const { project } = data;

  const clientName =
    project.client?.businessName ||
    [project.client?.firstName, project.client?.lastName]
      .filter(Boolean)
      .join(" ");

  const siteAddress = project.siteAddress;

  return (
    <div className={styles.container}>
      <Link href="/dashboard/projects" className={styles.backLink}>
        ← Back to All Projects
      </Link>

      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1 className={styles.title}>{project.title}</h1>

          <Link
            href={`/dashboard/projects/${project.id}/edit`}
            className={styles.editButton}
          >
            Edit
          </Link>
        </div>

        <div className={styles.metaGrid}>
          <p className={styles.metaItem}>
            <strong>Status:</strong> {project.status}
          </p>
          <p className={styles.metaItem}>
            <strong>Client:</strong> {clientName || "Unknown client"}
          </p>
          <p className={styles.metaItem}>
            <strong>Site Address:</strong>{" "}
            {siteAddress
              ? `${siteAddress.line1}${
                  siteAddress.line2 ? ", " + siteAddress.line2 : ""
                }, ${siteAddress.city}${
                  siteAddress.state ? " " + siteAddress.state : ""
                } ${siteAddress.postcode}`
              : "No site address set"}
          </p>
        </div>

        <p className={styles.description}>
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Tasks section if you want it later:
      <section className={styles.section}>
        <h2>Tasks</h2>
        {project.tasks?.length ? (
          <ul className={styles.taskList}>
            {project.tasks.map((task: any) => (
              <li key={task.id} className={styles.taskItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggleTask(task)}
                  />
                  {task.title}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks for this project.</p>
        )}
      </section>
      */}
    </div>
  );
}
