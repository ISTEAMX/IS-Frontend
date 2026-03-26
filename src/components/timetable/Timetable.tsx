import React, { useMemo } from "react";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import { DAYS, TIME_SLOTS } from "@/constants/timetable.constants";
import styles from "./Timetable.module.css";
import ActivityCard from "./ActivityCard";
import { formatHour, generateSortedTimeSlots } from "@/utils/timetableUtils";

interface TimetableProps {
  events?: ScheduleEvent[];
}

const Timetable = ({ events = [] }: TimetableProps) => {
  const activeTimeSlots = useMemo(() => {
    return generateSortedTimeSlots(events, TIME_SLOTS);
  }, [events]);

  return (
    <div className={styles.timetableContainer}>
      <div className={styles.timetableGrid}>
        <div className={styles.headerCell}></div>
        {DAYS.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}

        {activeTimeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className={styles.timeLabel}>
              <span>{time.split(" - ")[0]}</span>
              <span className={styles.timeDivider}>|</span>
              <span>{time.split(" - ")[1]}</span>
            </div>

            {DAYS.map((day) => {
              const currentEvents = events.filter(
                (e) =>
                  e.day === day &&
                  `${formatHour(e.startHour)} - ${formatHour(e.endHour)}` ===
                    time,
              );

              return (
                <div key={`${day}-${time}`} className={styles.gridCell}>
                  {currentEvents.map((event) => (
                    <ActivityCard key={event.id} event={event} />
                  ))}
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
