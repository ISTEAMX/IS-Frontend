import { FiLogOut } from "react-icons/fi";
import styles from "./UserAvatar.module.css";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const UserAvatar = () => {
  const navigate = useNavigate();
  const { userData, logout } = useAuthStore();

  if (!userData) return null;

  const isAdmin = userData.role === "ADMIN";

  const handleClick = () => {
    if (isAdmin) {
      navigate("/admin");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    toast.success("Te-ai deconectat cu succes!");
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.userInfo} ${isAdmin ? styles.adminLink : ""}`}
        onClick={handleClick}
        title={isAdmin ? "Mergi la Panou Admin" : ""}
      >
        <div className={styles.avatarCircle}>
          {userData.firstName[0]}
          {userData.lastName[0]}
        </div>
        <span className={styles.userName}>
          {userData.lastName} {userData.firstName}
        </span>
      </div>

      <button
        className={styles.logoutButton}
        onClick={handleLogout}
        title="Deconectare"
      >
        <FiLogOut />
      </button>
    </div>
  );
};

export default UserAvatar;
