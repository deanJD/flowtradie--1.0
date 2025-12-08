'use client';

import React, { use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { GET_CLIENT } from '@/app/lib/graphql/queries/client';
import { DELETE_PROJECT_MUTATION } from '@/app/lib/graphql/mutations/project';

import Button from '@/components/Button/Button';
import styles from './ClientDetailsPage.module.css';

// 👇 Helper for formatting currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
};

export default function ClientDetailsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery(GET_CLIENT, {
    variables: { id: clientId },
  });

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    onCompleted: () => refetch(),
  });

  if (loading) return <p className={styles.loading}>Loading profile...</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;
  if (!data?.client) return <p>Client not found.</p>;

  const { client } = data;

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject({ variables: { deleteProjectId: projectId } });
    }
  };

  return (
    <div className={styles.container}>
      {/* --- HEADER --- */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/dashboard/clients" className={styles.backLink}>← Back to Clients</Link>
          <h1 className={styles.title}>
            {client.businessName || `${client.firstName} ${client.lastName}`}
          </h1>
          <span className={styles.clientTypeBadge}>{client.type}</span>
        </div>
        <div className={styles.headerActions}>
           <Button href={`/dashboard/clients/${client.id}/edit`} variant="secondary">
             Edit Profile
           </Button>
        </div>
      </div>

      <div className={styles.grid}>
        
        {/* --- LEFT COLUMN (Contact & Address) --- */}
        <div className={styles.leftColumn}>
          
          {/* Contact Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Contact Details</h2>
            <div className={styles.infoRow}>
              <label>Full Name</label>
              <p>{client.firstName} {client.lastName}</p>
            </div>
            <div className={styles.infoRow}>
              <label>Email</label>
              <p><a href={`mailto:${client.email}`} className={styles.link}>{client.email}</a></p>
            </div>
            <div className={styles.infoRow}>
              <label>Phone</label>
              <p>{client.phone || '—'}</p>
            </div>
          </div>

          {/* Addresses Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Addresses</h2>
            {client.addresses && client.addresses.length > 0 ? (
              <ul className={styles.addressList}>
                {client.addresses.map((addr: any) => (
                  <li key={addr.id} className={styles.addressItem}>
                    <div className={styles.addressHeader}>
                      <span className={styles.addressType}>{addr.addressType}</span>
                    </div>
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>{addr.city}, {addr.state} {addr.postcode}</p>
                    <p>{addr.country}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyText}>No addresses found.</p>
            )}
          </div>

          {/* Notes */}
          {client.notes && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Notes</h2>
              <p className={styles.notes}>{client.notes}</p>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN (Projects & Invoices) --- */}
        <div className={styles.rightColumn}>
          
          {/* 1. PROJECTS CARD */}
          <div className={styles.card}>
            <div className={styles.cardHeaderRow}>
              <h2 className={styles.cardTitle}>Projects</h2>
              <Link 
                   href={`/dashboard/projects/new?clientId=${client.id}`} 
                   className={styles.addLink}>+ New Project</Link>
            </div>

            {client.projects && client.projects.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {client.projects.map((project: any) => (
                    <tr key={project.id}>
                      <td className={styles.mainCell}>
                        <Link href={`/dashboard/projects/${project.id}`} className={styles.projectLink}>
                          {project.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[project.status.toLowerCase()]}`}>
                          {project.status.toLowerCase()}
                        </span>
                      </td>
                      
                      {/* 👇 HARDCODED DROPDOWN */}
                      <td style={{ textAlign: 'right', position: 'relative' }}>
                        <div className={styles.dropdown}>
                          <button className={styles.dropdownButton}>•••</button>
                          
                          <div className={styles.dropdownMenu}>
                            <button onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
                              View Details
                            </button>
                            <button onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}>
                              Edit Project
                            </button>
                            <button onClick={() => handleDeleteProject(project.id)} className={styles.deleteAction}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>
                <p>No projects for this client yet.</p>
              </div>
            )}
          </div>

          {/* 2. 💰 INVOICES CARD (NEW) */}
          <div className={styles.card}>
            <div className={styles.cardHeaderRow}>
              <h2 className={styles.cardTitle}>Invoices</h2>
              {/* 👇 Smart Link: Pre-selects this client for the new invoice */}
              <Link 
                href={`/dashboard/invoices/new?clientId=${client.id}`} 
                className={styles.addLink}
              >
                + New Invoice
              </Link>
            </div>

            {client.invoices && client.invoices.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {client.invoices.map((inv: any) => (
                    <tr key={inv.id}>
                      <td className={styles.mainCell}>
                        <Link href={`/dashboard/invoices/${inv.id}`} className={styles.projectLink}>
                          {inv.invoiceNumber || '—'}
                        </Link>
                      </td>
                      <td>
                        {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                      </td>
                      <td>{formatCurrency(inv.totalAmount)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[inv.status.toLowerCase()]}`}>
                          {inv.status.toLowerCase()}
                        </span>
                      </td>
                      
                      {/* Dropdown for Invoices */}
                      <td style={{ textAlign: 'right', position: 'relative' }}>
                        <div className={styles.dropdown}>
                          <button className={styles.dropdownButton}>•••</button>
                          <div className={styles.dropdownMenu}>
                            <button onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}>
                              View
                            </button>
                            <button onClick={() => router.push(`/dashboard/invoices/${inv.id}/edit`)}>
                              Edit
                            </button>
                            {/* Assumes you have a route to view/download PDF */}
                            <button onClick={() => window.open(`/api/invoices/${inv.id}/pdf`, '_blank')}>
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>
                <p>No invoices raised yet.</p>
                <Button href={`/dashboard/invoices/new?clientId=${client.id}`} variant="secondary">
                  Create First Invoice
                </Button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}