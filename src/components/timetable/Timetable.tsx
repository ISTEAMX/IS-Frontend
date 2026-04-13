import React, { useMemo } from "react";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import { DAYS, TIME_SLOTS } from "@/constants/timetable.constants";
import styles from "./Timetable.module.css";
import ActivityCard from "./ActivityCard";
import { formatHour, generateSortedTimeSlots } from "@/utils/timetableUtils";
import { BiPlus } from "react-icons/bi";

interface TimetableProps {
  events?: ScheduleEvent[];
  handleOpenEdit: (event: ScheduleEvent) => void;
  handleOpenAddAtSlot: (day: string, timeSlot: string) => void;
}

const Timetable = ({
  events = [],
  handleOpenEdit,
  handleOpenAddAtSlot,
}: TimetableProps) => {
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
                  e.scheduleDay === day &&
                  `${formatHour(e.startingHour)} - ${formatHour(e.endingHour)}` ===
                    time,
              );

              const isEmpty = currentEvents.length === 0;

              return (
                <div
                  key={`${day}-${time}`}
                  className={`${styles.gridCell} ${isEmpty ? styles.emptyCell : ""}`}
                  onClick={() => isEmpty && handleOpenAddAtSlot(day, time)}
                  role={isEmpty ? "button" : undefined}
                  tabIndex={isEmpty ? 0 : undefined}
                >
                  {isEmpty ? (
                    <div className={styles.addSuggestion}>
                      <div className={styles.iconContainer}>
                        <BiPlus className={styles.icon} />
                      </div>
                    </div>
                  ) : (
                    currentEvents.map((event) => (
                      <ActivityCard
                        key={event.id}
                        event={event}
                        handleClick={(e) => {
                          e?.stopPropagation();
                          handleOpenEdit(event);
                        }}
                      />
                    ))
                  )}
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
