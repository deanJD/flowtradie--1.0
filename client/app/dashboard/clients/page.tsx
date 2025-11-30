// client/app/dashboard/clients/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useAuth } from "@/app/context/AuthContext";
import { GET_CLIENTS_QUERY } from "@/app/lib/graphql/queries/clients";
import Button from "@/components/Button/Button";
import styles from "./ClientsPage.module.css";

export default function ClientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // 🔐 Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // 🧠 Fetch clients ONLY IF businessId is ready
  const { data, loading, error } = useQuery(GET_CLIENTS_QUERY, {
    variables: { businessId: user?.businessId },
    skip: !user?.businessId,
    fetchPolicy: "network-only",
  });

  if (authLoading || loading) return <p>Loading clients...</p>;
  if (error) return <p>Error loading clients: {error.message}</p>;

  const clients = data?.clients ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Clients</h1>
        <Button href="/dashboard/clients/new">+ Add Client</Button>
      </div>

      {clients.length === 0 ? (
        <p>No clients found yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Business</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c: any) => (
              <tr key={c.id}>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.email || "—"}</td>
                <td>{c.phone || "—"}</td>
                <td>{c.businessName || "—"}</td>
                <td>
                  <Link href={`/dashboard/clients/${c.id}`} className={styles.viewLink}>
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
