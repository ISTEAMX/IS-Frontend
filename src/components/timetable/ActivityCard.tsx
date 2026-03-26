import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import styles from "./ActivityCard.module.css";
import { FiMapPin, FiTag, FiUser } from "react-icons/fi";

interface ActivityCardProps {
  event: ScheduleEvent;
}

const ActivityCard = ({ event }: ActivityCardProps) => {
  const getCardStyle = (type: string) => {
    switch (type) {
      case "Curs":
        return styles.cardCurs;
      case "Laborator":
        return styles.cardLab;
      case "Seminar":
        return styles.cardSeminar;
      case "Proiect":
        return styles.cardProiect;
      default:
        return "";
    }
  };

  return (
    <div className={`${styles.card} ${getCardStyle(event.type)}`}>
      <div className={styles.cardHeader}>
        <div className={styles.typeLabel}>{event.type}</div>
        {event.frequency !== "săptămânal" && (
          <div className={styles.frequencyBadge}>
            {event.frequency === "pară" ? "Pară" : "Impară"}
          </div>
        )}
      </div>

      <div className={styles.eventName} title={event.name}>
        {event.name}
      </div>

      <div className={styles.detailsRow}>
        <FiUser className={styles.icon} />
        <span>{event.teacher}</span>
      </div>

      <div className={styles.detailsRow}>
        <FiTag className={styles.icon} />
        <span>{event.group}</span>
      </div>

      <div className={styles.detailsRow}>
        <FiMapPin className={styles.icon} />
        <span>{event.room}</span>
      </div>
    </div>
  );
};

export default ActivityCard;
