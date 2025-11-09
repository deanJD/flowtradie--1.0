'use client';
import React from "react";
import styles from "./DeleteConfirmModal.module.css";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoiceNumber?: string;
}

export default function DeleteConfirmModal({ isOpen, invoiceNumber, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Delete Invoice?</h2>

        <p className={styles.message}>
          Are you sure you want to delete invoice <strong>{invoiceNumber}</strong>?  
          This action cannot be undone.
        </p>

        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.deleteBtn} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
