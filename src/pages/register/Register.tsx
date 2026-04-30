import { InputField } from "@/components/ui/InputField";
import { FiMail, FiLock, FiUser, FiBriefcase } from "react-icons/fi";
import styles from "./Register.module.css";
import logo from "@/assets/logo.svg";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import type { RegisterDTO, UserRole } from "@/types/Auth.types";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("PROFESSOR");
  const [department, setDepartment] = useState(
    "Calculatoare și Tehnologia Informației",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Toate câmpurile sunt obligatorii.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Parolele nu se potrivesc.");
      return;
    }

    if (password.length < 8) {
      toast.error("Parola trebuie să aibă cel puțin 8 caractere.");
      return;
    }

    setIsLoading(true);

    const payload: RegisterDTO = {
      firstName,
      lastName,
      email,
      password,
      role,
      professor: {
        department: department,
      },
    };

    try {
      await authService.register(payload);
      toast.success(
        `${role === "ADMIN" ? "Administrator" : "Profesor"} înregistrat cu succes.`,
      );
      navigate("/admin/teachers");
    } catch {
      toast.error(
        "A apărut o eroare. Verificați datele sau dacă email-ul există deja.",
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
          </div>

          <form onSubmit={handleRegister} className={styles.registerForm}>
            <div className={styles.formField}>
              <label className={styles.label}>Rol</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.selectInput}
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="PROFESSOR">Profesor</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <div className={styles.nameRow}>
              <InputField
                id="lastName"
                type="text"
                label="Nume"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Numele..."
                icon={<FiUser />}
                autoComplete="off"
                required
              />

              <InputField
                id="firstName"
                type="text"
                label="Prenume"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prenumele..."
                icon={<FiUser />}
                autoComplete="off"
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

            <InputField
              id="department"
              type="text"
              label="Departament"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Ex: Calculatoare..."
              icon={<FiBriefcase />}
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
