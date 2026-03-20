import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import Header from "@/components/header/Header";

export const MainLayout = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContainer}>
        <Outlet />
      </main>
    </div>
  );
};
