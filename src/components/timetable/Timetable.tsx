import React, { useMemo } from "react";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import { DAYS, TIME_SLOTS } from "@/constants/timetable.constants";
import styles from "./Timetable.module.css";
import ActivityCard from "./ActivityCard";
import { formatHour, generateSortedTimeSlots } from "@/utils/timetableUtils";
import { BiPlus } from "react-icons/bi";
import { useAuthStore } from "@/store/useAuthStore";

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
  const { isAuthenticated, userData } = useAuthStore();
  const canAdd =
    isAuthenticated &&
    (userData?.role === "ADMIN" || userData?.role === "PROFESSOR");

  const activeTimeSlots = useMemo(() => {
    return generateSortedTimeSlots(events, TIME_SLOTS);
  }, [events]);

  const groupedEvents = useMemo(() => {
    const map: Record<string, ScheduleEvent[]> = {};

    events.forEach((event) => {
      const timeKey = `${formatHour(event.startingHour)} - ${formatHour(event.endingHour)}`;
      const key = `${event.scheduleDay}-${timeKey}`;

      if (!map[key]) map[key] = [];
      map[key].push(event);
    });

    return map;
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
              const currentEvents = groupedEvents[`${day}-${time}`] || [];

              const isEmpty = currentEvents.length === 0;
              const canClickEmpty = isEmpty && canAdd;

              return (
                <div
                  key={`${day}-${time}`}
                  className={`${styles.gridCell} ${canClickEmpty ? styles.emptyCell : ""}`}
                  onClick={() =>
                    canClickEmpty && handleOpenAddAtSlot(day, time)
                  }
                  role={isEmpty && canAdd ? "button" : undefined}
                  style={{ cursor: canClickEmpty ? "pointer" : "default" }}
                >
                  {isEmpty
                    ? canAdd && (
                        <div className={styles.addSuggestion}>
                          <div className={styles.iconContainer}>
                            <BiPlus className={styles.icon} />
                          </div>
                        </div>
                      )
                    : currentEvents.map((event) => (
                        <ActivityCard
                          key={event.id}
                          event={event}
                          handleClick={(e) => {
                            e?.stopPropagation();
                            handleOpenEdit(event);
                          }}
                        />
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
