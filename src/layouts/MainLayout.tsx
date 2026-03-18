import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";

export const MainLayout = () => {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContainer}>
        <Outlet />
      </main>
    </div>
  );
};
