// client/components/DataTable/DataTable.tsx (Golden Copy)
'use client';

import React from 'react';
import styles from './DataTable.module.css';

// This helper function safely gets nested property values (e.g., 'client.name')
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Define the shape of our component's props
interface DataTableProps {
  columns: Array<{
    header: string;
    accessor: string;
    render?: (row: any) => React.ReactNode;
    className?: string; // For applying special classes to columns, like our actionsCell
  }>;
  data: Array<any> | undefined; // The data can be undefined while loading
}

export default function DataTable({ columns, data }: DataTableProps) {
  // Handle the loading state
  if (data === undefined) {
    return (
      <div className={styles.tableContainer}>
        <p className={styles.emptyMessage}>Loading data...</p>
      </div>
    );
  }
  
  // Handle the empty state
  if (data.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <p className={styles.emptyMessage}>No data available.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.accessor} className={col.className}>
                  {col.render ? col.render(row) : getNestedValue(row, col.accessor)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}