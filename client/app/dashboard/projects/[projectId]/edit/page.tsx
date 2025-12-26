"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";

import { useAuth } from "@/app/context/AuthContext";
import { GET_PROJECT } from "@/app/lib/graphql/queries/project";
import { UPDATE_PROJECT_MUTATION } from "@/app/lib/graphql/mutations/project";
import { GET_PROJECTS } from "@/app/lib/graphql/queries/projects";

import styles from "./EditProjectPage.module.css";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;

  const { user, loading: authLoading } = useAuth();

  const { data, loading, error } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
    skip: !projectId,
  });

  const [updateProject, { loading: updating }] = useMutation(
    UPDATE_PROJECT_MUTATION,
    {
      refetchQueries: [{ query: GET_PROJECTS }],
    }
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "PENDING",
    budgetedAmount: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
    countryCode: "AU",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (data?.project) {
      const p = data.project;
      const a = p.siteAddress;

      setForm({
        title: p.title ?? "",
        description: p.description ?? "",
        status: p.status ?? "PENDING",
        budgetedAmount: p.budgetedAmount ?? "",
        line1: a?.line1 ?? "",
        line2: a?.line2 ?? "",
        city: a?.city ?? "",
        state: a?.state ?? "",
        postcode: a?.postcode ?? "",
        country: a?.country ?? "Australia",
        countryCode: a?.countryCode ?? "AU",
      });
    }
  }, [data]);

  if (!projectId) return <p>Invalid project id.</p>;
  if (authLoading || loading) return <p>Loading...</p>;
  if (error) return <p>Error loading project: {error.message}</p>;
  if (!data?.project) return <p>Project not found.</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateProject({
      variables: {
        id: projectId,
        input: {
          title: form.title,
          description: form.description || null,
          status: form.status,
          budgetedAmount: form.budgetedAmount
            ? Number(form.budgetedAmount)
            : null,
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

    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Edit Project</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
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
          <label className={styles.label}>Budgeted Amount</label>
          <input
            className={styles.input}
            name="budgetedAmount"
            type="number"
            value={form.budgetedAmount}
            onChange={handleChange}
          />
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

        <button className={styles.submitButton} type="submit" disabled={updating}>
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
