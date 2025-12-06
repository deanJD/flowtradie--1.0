"use client";

import React from "react";
import styles from "./DataTable.module.css";

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

interface ActionItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

interface DataTableProps {
  columns: Array<{
    header: string;
    accessor: string;
    render?: (row: any) => React.ReactNode;
  }>;
  data: any[];
  actions?: (row: any) => ActionItem[];
}

export default function DataTable({ columns, data, actions }: DataTableProps) {
  if (!data || data.length === 0) {
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

            {actions && <th className={styles.actionsCell}></th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row: any) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {col.render
                    ? col.render(row)
                    : getNestedValue(row, col.accessor)}
                </td>
              ))}

              {/* ACTIONS DROPDOWN */}
              {actions && (
                <td className={styles.actionsCell}>
                  <div className={styles.dropdown}>
                    <button className={styles.dropdownButton}>⋮</button>

                    <div className={styles.dropdownMenu}>
                      {actions(row).map((action, index) => (
                        <button
                          key={index}
                          className={
                            action.destructive
                              ? styles.deleteBtn
                              : undefined
                          }
                          onClick={action.onClick}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
