'use client';

import React, { useState, useRef, useEffect } from "react";
import styles from "./ActionsDropdown.module.css";

interface ActionItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

interface Props {
  actions: ActionItem[];
}

export default function ActionsDropdown({ actions }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.button} onClick={() => setOpen((o) => !o)}>
        ⋮
      </button>

      {open && (
        <div className={styles.menu}>
          {actions.map((action, i) => (
            <button
              key={i}
              className={`${styles.menuItem} ${action.destructive ? styles.destructive : ""}`}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
