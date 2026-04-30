import { InputField } from "@/components/ui/InputField";
import { FiLock } from "react-icons/fi";
import styles from "./ChangePassword.module.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userData = useAuthStore((state) => state.userData);
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Parola nouă trebuie să aibă cel puțin 8 caractere");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Parolele nu coincid");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Parola nouă trebuie să fie diferită de cea actuală");
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success("Parola a fost schimbată cu succes!");

      if (userData && token) {
        setAuth(token, { ...userData, passwordChanged: true });
      }

      if (userData?.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      toast.error("Eroare la schimbarea parolei. Verificați parola curentă.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContainer}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Schimbare parolă</h2>
            <p className={styles.cardSubtitle}>
              Trebuie să vă schimbați parola la prima autentificare.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <InputField
              id="currentPassword"
              type="password"
              label="Parola curentă"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Parola curentă..."
              icon={<FiLock />}
              required
            />

            <InputField
              id="newPassword"
              type="password"
              label="Parola nouă"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Parola nouă..."
              icon={<FiLock />}
              required
            />

            <InputField
              id="confirmPassword"
              type="password"
              label="Confirmă parola nouă"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmă parola nouă..."
              icon={<FiLock />}
              required
            />

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Se procesează..." : "Schimbă parola"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ChangePassword;

