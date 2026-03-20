import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export const MainLayout = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContainer}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
