import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <main className={styles.main}>
      <div className={styles.errorNumbers}>404</div>

      <h1 className={styles.title}>Pagina nu a fost găsită</h1>

      <p className={styles.description}>
        Această resursă nu este disponibilă momentan sau nu există.
      </p>

      <Link to="/" className={styles.homeBtn}>
        Înapoi la pagina principală
      </Link>
    </main>
  );
};

export default NotFound;
