import { InputField } from "@/components/ui/InputField";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import styles from "./Register.module.css";
import logo from "@/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { api } from "@/services/api";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword)
      return;

    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await api.register({ firstName, lastName, email, password });
      navigate("/login");
    } catch (err) {
      console.error("Eroare la înregistrare", err);
      setError(
        err instanceof Error ? err.message : "A apărut o eroare. Încercați din nou."
      );
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
            <h2 className={styles.cardTitle}>Înregistrare</h2>
            <p className={styles.cardSubtitle}>
              Creează un cont pentru a accesa panoul de gestiune.
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
                placeholder="Prenumele tău..."
                icon={<FiUser />}
                required
              />

              <InputField
                id="lastName"
                type="text"
                label="Nume"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Numele tău..."
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
              placeholder="Adresa ta de email..."
              icon={<FiMail />}
              required
            />

            <InputField
              id="password"
              type="password"
              label="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Alege o parolă..."
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

            {error && <p className={styles.errorMessage}>{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Se creează contul..." : "Creează cont"}
            </button>
          </form>

          <div className={styles.loginRedirectSection}>
            <p className={styles.loginRedirectText}>
              Ai deja un cont?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className={styles.loginLink}
              >
                Autentifică-te
              </a>
            </p>
          </div>
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
