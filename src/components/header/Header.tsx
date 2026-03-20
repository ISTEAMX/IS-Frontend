import { Link } from "react-router-dom";
import LoginButton from "../ui/LoginButton";
import styles from "./Header.module.css";
import logo from "@/assets/logo.svg";

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <Link to="/" className={styles.headerLogo}>
        <img src={logo} alt="Logo" />
        <span>UniSync</span>
      </Link>

      <LoginButton />
    </header>
  );
};

export default Header;
