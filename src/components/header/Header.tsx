import { Link } from "react-router-dom";
import LoginButton from "../ui/LoginButton";
import styles from "./Header.module.css";
import logo from "@/assets/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import UserAvatar from "../userAvatar/UserAvatar";

const Header = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header className={styles.headerContainer}>
      <Link to="/" className={styles.headerLogo}>
        <img src={logo} alt="Logo" />
        <span>UniSync</span>
      </Link>

      {isAuthenticated ? <UserAvatar /> : <LoginButton />}
    </header>
  );
};

export default Header;
