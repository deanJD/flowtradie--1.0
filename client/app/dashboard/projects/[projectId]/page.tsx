// client/app/dashboard/projects/[projectId]/page.tsx
"use client";

import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";

import { GET_PROJECT } from "@/app/lib/graphql/queries/project";
import { UPDATE_TASK_MUTATION } from "@/app/lib/graphql/mutations/task";

import styles from "./ProjectDetailsPage.module.css";

interface ProjectDetailsPageProps {
  params: { projectId: string };
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { projectId } = params;

  // 👇 Make sure GET_PROJECT is defined as: query GetProject($id: ID!) { project(id: $id) { ... } }
  const { data, loading, error, refetch } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
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

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.project) return <p>Project not found.</p>;

  const { project } = data;

  const clientName =
    project.client?.businessName ||
    [project.client?.firstName, project.client?.lastName].filter(Boolean).join(" ");

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

      {/* TODO: hook these back up to real data if not already */}
      {/* Example structure for later: */}
      {/* 
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
