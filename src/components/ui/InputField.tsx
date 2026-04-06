import { useState, type ChangeEvent, type ReactNode } from "react";
import styles from "./InputField.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputFieldProps {
  id: string;
  label: string;
  type?: "text" | "password" | "email";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
  rightAction?: ReactNode;
  autoComplete?: "off" | "on";
}

export const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  rightAction,
  autoComplete = "on",
}: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";
  const currentInputType = isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <div className={styles.formGroup}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {rightAction && rightAction}
      </div>

      <div className={styles.inputWrapper}>
        {icon && (
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>{icon}</span>
          </div>
        )}
        <input
          type={currentInputType}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${styles.input} ${isPasswordField ? styles.inputWithToggle : ""}`}
          autoComplete={autoComplete}
        />

        {isPasswordField && (
          <button
            type="button"
            className={styles.passwordToggleBtn}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            aria-label={isPasswordVisible ? "Ascunde parola" : "Arată parola"}
          >
            {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};
