import { Link, NavLink, Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import logo from "@/assets/logo.svg";
import { LuBuilding, LuUser, LuClipboardList } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi2";

const AdminLayout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.header}>
          <img src={logo} alt="" />
          <span>UniSync</span>
        </Link>

        <nav className={styles.menu}>
          <NavLink
            to="/admin/rooms"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            <LuBuilding size={20} /> <span>Săli</span>
          </NavLink>
          <NavLink
            to="/admin/teachers"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            <LuUser size={20} /> <span>Profesori</span>
          </NavLink>
          <NavLink
            to="/admin/groups"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            <HiOutlineUserGroup size={20} /> <span>Grupe</span>
          </NavLink>
          <NavLink
            to="/admin/subjects"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            <LuClipboardList size={20} /> <span>Discipline</span>
          </NavLink>
        </nav>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
