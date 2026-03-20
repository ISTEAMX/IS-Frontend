import LoginButton from "../ui/LoginButton";
import styles from "./Header.module.css";
import logo from "@/assets/logo.svg";

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerLogo}>
        <img src={logo} alt="Logo" />
        <span>UniSync</span>
      </div>

      <LoginButton />
    </header>
  );
};

export default Header;
