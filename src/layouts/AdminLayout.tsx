import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
