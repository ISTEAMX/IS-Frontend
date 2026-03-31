import { InputField } from "@/components/ui/InputField";
import { FiMail, FiLock } from "react-icons/fi";
import styles from "./Login.module.css";
import logo from "@/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  console.log("login form")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { token, userData } = response;
      setAuth(token, userData);
      if (userData.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Eroare la autentificare", err);
      toast.error("Eroare la autentificare");
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

        <section className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Autentificare</h2>
            <p className={styles.cardSubtitle}>
              Introduceți datele pentru a accesa panoul de gestiune.
            </p>
          </div>

          <form onSubmit={handleLogin} className={styles.loginForm}>
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
              placeholder="Parola ta..."
              icon={<FiLock />}
              required
              rightAction={
                <a href="#" className={styles.forgotPassword}>
                  Ai uitat parola?
                </a>
              }
            />

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Se autentifică..." : "Autentificare"}
            </button>
          </form>

          <div className={styles.publicAccessSection}>
            <p className={styles.publicAccessTitle}>Acces Public</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className={styles.publicButton}
            >
              Vezi Orar (Student / Vizitator)
            </button>
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

export default Login;
