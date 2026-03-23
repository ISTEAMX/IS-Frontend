import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { LuUser, LuDoorOpen, LuBook } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi2";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.header}>
        <img src={logo} alt="UniSync Logo" />
        <h1>UniSync</h1>
      </Link>

      <nav className={styles.menu}>
        <NavLink
          to="/admin/rooms"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.activeLink}` : styles.link
          }
        >
          <LuDoorOpen size={20} /> <span>Săli</span>
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
          <LuBook size={20} /> <span>Discipline</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
