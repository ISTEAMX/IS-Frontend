import React from "react";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import { DAYS, TIME_SLOTS } from "@/constants/timetable.constants";
import styles from "./Timetable.module.css";
import ActivityCard from "./ActivityCard";

interface TimetableProps {
  events?: ScheduleEvent[];
}

const Timetable = ({ events = [] }: TimetableProps) => {
  return (
    <div className={styles.timetableContainer}>
      <div className={styles.timetableGrid}>
        <div className={styles.headerCell}></div>
        {DAYS.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}

        {TIME_SLOTS.map((time) => (
          <React.Fragment key={time}>
            <div className={styles.timeLabel}>
              <span>{time.split(" - ")[0]}</span>
              <span className={styles.timeDivider}>|</span>
              <span>{time.split(" - ")[1]}</span>
            </div>

            {DAYS.map((day) => {
              const currentEvent = events.find(
                (e) => e.day === day && e.timeSlot === time,
              );

              return (
                <div key={`${day}-${time}`} className={styles.gridCell}>
                  {currentEvent ? <ActivityCard event={currentEvent} /> : null}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
