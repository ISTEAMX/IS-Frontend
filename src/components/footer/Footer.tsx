import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} UniSync. Toate drepturile rezervate.</p>
    </footer>
  );
};

export default Footer;
