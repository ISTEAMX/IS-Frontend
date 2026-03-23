import type { ReactNode } from "react";
import styles from "./InfoCard.module.css";

interface InfoCardProps {
  title?: string;
  info?: ReactNode;
}

const InfoCard = ({ title, info }: InfoCardProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.info}>{info}</span>
    </div>
  );
};

export default InfoCard;
