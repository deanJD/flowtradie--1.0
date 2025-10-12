// client/components/ListPageLayout/ListPageLayout.tsx
'use client';

import React from 'react';
import styles from './ListPageLayout.module.css';
import Button from '../Button/Button'; // We'll use our reusable Button

// Define the props our layout will accept
interface ListPageLayoutProps {
  children: React.ReactNode;
  title: string;
  newButtonText?: string;
  newButtonLink?: string;
  // We can add more props later, like for search functionality
}

export default function ListPageLayout({
  children,
  title,
  newButtonText,
  newButtonLink,
}: ListPageLayoutProps) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.actions}>
          <input type="search" placeholder={`Search ${title.toLowerCase()}...`} className={styles.searchBar} />
          {/* Only show the "New" button if the text and link are provided */}
          {newButtonText && newButtonLink && (
            <Button href={newButtonLink}>
              {newButtonText}
            </Button>
          )}
        </div>
      </div>
      
      {/* This is where the main content of the page (like our DataTable) will be rendered */}
      {children}
    </div>
  );
}