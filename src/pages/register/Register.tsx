import { InputField } from "@/components/ui/InputField";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import styles from "./Register.module.css";
import logo from "@/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/auth";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword)
      return;

    if (password !== confirmPassword) {
      toast.error("Parolele nu se potrivesc.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ firstName, lastName, email, password });
      
      toast.success("Profesor înregistrat cu succes.");
      navigate("/admin/teachers");
    } catch (err) {
      console.error("Eroare la înregistrare", err);
      toast.error("A apărut o eroare. Încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContainer}>
        <header className={styles.brandingHeader}>
          <div className={styles.logoBox}>
            <img src={logo} alt="Logo" />
          </div>
          <h1 className={styles.brandTitle}>UniSync</h1>
        </header>

        <section className={styles.registerCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Înregistrare Profesor</h2>
            <p className={styles.cardSubtitle}>
              Creează un cont pentru un profesor.
            </p>
          </div>

          <form onSubmit={handleRegister} className={styles.registerForm}>
            <div className={styles.nameRow}>
              <InputField
                id="firstName"
                type="text"
                label="Prenume"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prenumele..."
                icon={<FiUser />}
                required
              />

              <InputField
                id="lastName"
                type="text"
                label="Nume"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Numele..."
                icon={<FiUser />}
                required
              />
            </div>

            <InputField
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresa de email..."
              icon={<FiMail />}
              required
            />

            <InputField
              id="password"
              type="password"
              label="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolă..."
              icon={<FiLock />}
              required
            />

            <InputField
              id="confirmPassword"
              type="password"
              label="Confirmă Parola"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetă parola..."
              icon={<FiLock />}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Se creează contul..." : "Creează cont"}
            </button>
          </form>
        </section>

        <footer className={styles.footer}>
          <p>
            © {new Date().getFullYear()} UniSync. Toate drepturile rezervate.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Register;
