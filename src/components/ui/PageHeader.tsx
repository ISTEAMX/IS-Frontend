import { LuPlus } from "react-icons/lu";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  onAddClick: () => void;
}

export const PageHeader = ({
  title,
  buttonText="Adaugă",
  onAddClick,
}: PageHeaderProps) => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.pageTitle}>{title}</h1>

      <button className={styles.addButton} onClick={onAddClick}>
        <LuPlus size={18} />
        <span>{buttonText}</span>
      </button>
    </div>
  );
};
