// client/components/Input/Input.tsx
'use client';

import React from 'react';
import styles from './Input.module.css';

// Define the props our component will accept.
// It extends all the standard HTML input attributes.
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, id, ...rest }: InputProps) {
  // If an 'id' is not provided, we'll auto-generate one from the label
  // This is important for accessibility (linking the label to the input).
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={styles.input}
        {...rest} // This passes down all other props like 'value', 'onChange', 'type', 'required', etc.
      />
    </div>
  );
}