import { useEffect, useRef } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: ConfirmModalProps) => {
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
      <div className={styles.modalCard}>
        <div className={styles.iconContainer}>
          <div className={styles.iconCircle}>
            <HiOutlineExclamationCircle />
          </div>
        </div>

        <div className={styles.textContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>
            Anulează
          </button>
          <button className={styles.btnDelete} onClick={onConfirm}>
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
