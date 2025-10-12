// This directive is required by Next.js to mark this as an interactive,
// browser-based component, since it uses hooks like useQuery.
'use client';

// 1. THE IMPORTS (The "Tools" for the job)
// ===========================================
import React from 'react'; // The core React library.
import { useQuery } from '@apollo/client'; // The hook we use to fetch data from our GraphQL API.
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects'; // The specific GraphQL query string for getting all projects.
import Link from 'next/link'; // The Next.js component for creating fast, client-side links.
import DataTable from '@/components/DataTable/DataTable'; // Our new, reusable component for rendering tables.
import ListPageLayout from '@/components/ListPageLayout/ListPageLayout'; // Our new, reusable component for the page's overall layout.
import tableStyles from '@/components/DataTable/DataTable.module.css'; // We import the DataTable's styles to use its helper classes (like .status).

// 2. THE HELPER FUNCTION (Small, self-contained logic)
// ====================================================
// This function's only job is to map a status string (like "ACTIVE")
// to a specific CSS class name from our stylesheet.
const getStatusClass = (status: string) => {
  switch (status) {
    case 'COMPLETED': return tableStyles.statusCompleted;
    case 'ACTIVE': return tableStyles.statusActive;
    case 'PENDING': return tableStyles.statusPending;
    default: return tableStyles.statusPending;
  }
};

// 3. THE MAIN COMPONENT (The "Coordinator")
// ==========================================
export default function ProjectsPage() {
  // 4. DATA FETCHING: Ask Apollo for the list of projects.
  // We give it our query, and it gives us back three crucial things:
  // - `data`: The actual projects data when it arrives.
  // - `loading`: A boolean that is `true` while the request is in progress.
  // - `error`: An object containing any errors if the request fails.
  const { data, loading, error } = useQuery(GET_PROJECTS_QUERY);

  // 5. THE "BLUEPRINT": Define the columns for the DataTable.
  // This is a set of instructions that tells our generic DataTable
  // exactly what to show for a list of projects.
  const projectColumns = [
    {
      header: 'Project Title', // The text for the table header (<th>).
      accessor: 'title',       // The key to get the data from a project object.
      // A custom `render` function. We use this when we want to show something
      // more complex than just plain text, like a clickable link.
      render: (row: any) => (
        <Link href={`/dashboard/projects/${row.id}`} className={tableStyles.tableLink}>
          {row.title}
        </Link>
      )
    },
    {
      header: 'Client',
      accessor: 'client.name' // The accessor can use dot notation for nested objects.
    },
    {
      header: 'Status',
      accessor: 'status',
      // Another custom renderer to display our colored "status pill".
      render: (row: any) => (
        <span className={`${tableStyles.status} ${getStatusClass(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      // Another custom renderer to create the "Edit" link.
      render: (row: any) => (
        <Link href={`/dashboard/projects/${row.id}/edit`} className={tableStyles.tableLink}>Edit</Link>
      )
    }
  ];

  // 6. HANDLE LOADING AND ERROR STATES (Good User Experience)
  // It's a best practice to handle these states before trying to render the main UI.
  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // 7. THE FINAL RENDER (Putting it all together)
  // =================================================
  return (
    // We use our reusable layout component as the main "frame".
    // We pass it props to configure the title and the "New Project" button.
    <ListPageLayout
      title="Projects"
      newButtonText="+ New Project"
      newButtonLink="/dashboard/projects/new"
    >
      {/* This is the payoff. All the complex table HTML is gone.
        We just render our reusable DataTable. It takes two ingredients:
        - `columns`: The "blueprint" we defined above.
        - `data`: The raw `projects` array from our GraphQL query.
        The DataTable component itself will do all the work of looping and rendering.
      */}
      <DataTable columns={projectColumns} data={data?.projects} />
    </ListPageLayout>
  );
}