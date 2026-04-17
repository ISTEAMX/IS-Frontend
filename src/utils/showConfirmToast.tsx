import ConfirmToast from "@/components/ui/ConfirmToast";
import { toast } from "react-hot-toast";

interface ConfirmToastOptions {
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export const showConfirmToast = ({
  message = "Sigur doriți să faceți această acțiune?",
  confirmText = "Da",
  cancelText = "Nu",
  onConfirm,
}: ConfirmToastOptions): void => {
  toast.dismiss();

  toast(
    (t) => (
      <ConfirmToast
        t={t}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
      />
    ),
    {
      duration: 5000,
      position: "top-center",
      style: {
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        minWidth: "350px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        border: "1px solid #f0f0f0",
      },
    },
  );
};
