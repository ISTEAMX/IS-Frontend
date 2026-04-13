import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import styles from "./ActivityCard.module.css";
import { FiMapPin, FiTag, FiUser } from "react-icons/fi";

interface ActivityCardProps {
  event: ScheduleEvent;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ActivityCard = ({ event, handleClick }: ActivityCardProps) => {
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
    <div
      className={`${styles.card} ${getCardStyle(event.subjectDTO.activityType)}`}
      onClick={handleClick}
    >
      <div className={styles.cardHeader}>
        <div className={styles.typeLabel}>{event.subjectDTO.activityType}</div>
        {event.frequency !== "SAPTAMANAL" && (
          <div className={styles.frequencyBadge}>
            {event.frequency === "PARA" ? "Pară" : "Impară"}
          </div>
        )}
      </div>

      <div className={styles.eventName} title={event.subjectDTO.name}>
        {event.subjectDTO.name}
      </div>

      <div className={styles.detailsRow}>
        <FiUser className={styles.icon} />
        <span>
          {event.professorDTO.lastName + " " + event.professorDTO.firstName}
        </span>
      </div>

      <div className={styles.detailsRow}>
        <FiTag className={styles.icon} />
        <span>{event.groupDTO.identifier}</span>
      </div>

      <div className={styles.detailsRow}>
        <FiMapPin className={styles.icon} />
        <span>{event.roomDTO.name}</span>
      </div>
    </div>
  );
};

export default ActivityCard;
