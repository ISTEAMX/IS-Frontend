import { toast, type Toast } from "react-hot-toast";
import styles from "./ConfirmToast.module.css";

interface ConfirmToastProps {
  t: Toast;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void;
}

const ConfirmToast = ({
  t,
  message,
  confirmText,
  cancelText,
  onConfirm,
}: ConfirmToastProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.cancelBtn}`}
          onClick={() => toast.dismiss(t.id)}
        >
          {cancelText}
        </button>

        <button
          className={`${styles.btn} ${styles.confirmBtn}`}
          onClick={() => {
            toast.dismiss(t.id);
            if (onConfirm) onConfirm();
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmToast;
