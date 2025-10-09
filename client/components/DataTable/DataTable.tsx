// client/components/DataTable/DataTable.tsx
'use client';

import React from 'react';
import styles from './DataTable.module.css';

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

interface DataTableProps {
  columns: Array<{
    header: string;
    accessor: string;
    render?: (row: any) => React.ReactNode;
  }>;
  data: Array<any> | undefined; // Make data prop optional
}

export default function DataTable({ columns, data }: DataTableProps) {
  if (!data) {
    return <p>Loading data...</p>;
  }
  if (data.length === 0) {
    return <p>No data available.</p>
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
                <td key={col.accessor}>
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