'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`card ${styles.modal}`}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close Modal">
            <X className="sidebar-icon" />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        {/* <div className={styles.footer}>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button className="btn-primary">Save</button>
        </div> */}
      </div>
    </div>
  );
}