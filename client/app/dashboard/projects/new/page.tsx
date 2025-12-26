"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";

import { useAuth } from "@/app/context/AuthContext";
import { GET_CLIENTS } from "@/app/lib/graphql/queries/clients";
import { CREATE_PROJECT_MUTATION } from "@/app/lib/graphql/mutations/project";
import { GET_PROJECTS } from "@/app/lib/graphql/queries/projects";

import styles from "./NewProjectPage.module.css";

export default function NewProjectPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  const { data: clientsData, loading: clientsLoading, error: clientsError } =
    useQuery(GET_CLIENTS);

  const [createProject, { loading: creating }] = useMutation(
    CREATE_PROJECT_MUTATION,
    {
      refetchQueries: [{ query: GET_PROJECTS }],
    }
  );

  const [form, setForm] = useState({
    title: "",
    clientId: "",
    description: "",
    status: "PENDING",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
    countryCode: "AU",
  });

  if (authLoading || clientsLoading) return <p>Loading...</p>;
  if (!user) return null;
  if (clientsError) return <p>Error loading clients: {clientsError.message}</p>;

  const clients = clientsData?.clients ?? [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId) {
      alert("Please select a client");
      return;
    }

    await createProject({
      variables: {
        input: {
          title: form.title,
          clientId: form.clientId,
          description: form.description || null,
          status: form.status,
          siteAddress: form.line1
            ? {
                line1: form.line1,
                line2: form.line2 || null,
                city: form.city,
                state: form.state || null,
                postcode: form.postcode,
                country: form.country || null,
                countryCode: form.countryCode || null,
              }
            : null,
        },
      },
    });

    router.push("/dashboard/projects");
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>New Project</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Project info */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Client</label>
          <select
            className={styles.input}
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
          >
            <option value="">Select client</option>
            {clients.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.businessName ||
                  [c.firstName, c.lastName].filter(Boolean).join(" ")}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.input}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Site Address */}
        <h2 className={styles.subheading}>Site Address</h2>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Address Line 1</label>
          <input
            className={styles.input}
            name="line1"
            value={form.line1}
            onChange={handleChange}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Address Line 2</label>
          <input
            className={styles.input}
            name="line2"
            value={form.line2}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inlineGroup}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>City</label>
            <input
              className={styles.input}
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>State</label>
            <input
              className={styles.input}
              name="state"
              value={form.state}
              onChange={handleChange}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Postcode</label>
            <input
              className={styles.input}
              name="postcode"
              value={form.postcode}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className={styles.submitButton} type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
