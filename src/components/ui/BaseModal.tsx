import { useEffect, useRef, type ReactNode } from "react";
import styles from "./BaseModal.module.css";
import { LuX } from "react-icons/lu";

interface BaseModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  disabled?: boolean;
  children?: ReactNode;
}

const BaseModal = ({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = "OK",
  disabled = false,
  children,
}: BaseModalProps) => {
  const isOverlayClick = useRef(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      isOverlayClick.current = true;
    } else {
      isOverlayClick.current = false;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isOverlayClick.current) {
      onClose();
    }
    isOverlayClick.current = false;
  };

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>

          <LuX className={styles.xBtn} size={20} onClick={onClose} />
        </div>

        <div className={styles.content}>{children}</div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={onClose}
          >
            Anulează
          </button>
          <button
            className={`${styles.btn} ${styles.btnSubmit}`}
            onClick={onSubmit}
            disabled={disabled}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
