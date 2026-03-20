import { useNavigate } from "react-router-dom";
import styles from "./LoginButton.module.css";

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles.loginButton}
      onClick={() => navigate("/login")}
    >
      Login
    </button>
  );
};

export default LoginButton;
