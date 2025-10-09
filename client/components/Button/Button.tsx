// client/components/Button/Button.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

// Define the props (inputs) our button component will accept
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary'; // Allow choosing a style
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  // We can add more props here later, like 'isLoading'
}

export default function Button({
  children,
  onClick,
  href,
  variant = 'primary', // Default to the 'primary' style if not specified
  disabled = false,
  type = 'button',
}: ButtonProps) {
  // Automatically combine the base .button class with the chosen variant class (e.g., .primary)
  const className = `${styles.button} ${styles[variant]}`;

  // If an 'href' prop is passed, we know it's a link.
  // So, we render a Next.js <Link> component.
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  // If no 'href' is passed, we render a standard HTML <button>.
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}