import React, { useMemo, useState, useCallback } from "react";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import type { DayOfWeek } from "@/types/ScheduleEvent.types";
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
  handleDrop?: (event: ScheduleEvent, newDay: DayOfWeek, newTimeSlot: string) => void;
}

const Timetable = ({
  events = [],
  handleOpenEdit,
  handleOpenAddAtSlot,
  handleDrop,
}: TimetableProps) => {
  const { isAuthenticated, userData } = useAuthStore();
  const canAdd =
    isAuthenticated &&
    (userData?.role === "ADMIN" || userData?.role === "PROFESSOR");

  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

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

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, cellKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCell(cellKey);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragOverCell(null);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, day: string, time: string) => {
      e.preventDefault();
      setDragOverCell(null);

      if (!handleDrop) return;

      try {
        const eventData: ScheduleEvent = JSON.parse(
          e.dataTransfer.getData("application/json"),
        );
        handleDrop(eventData, day as DayOfWeek, time);
      } catch {
        console.error("Failed to parse dropped event data");
      }
    },
    [handleDrop],
  );

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
              const cellKey = `${day}-${time}`;
              const currentEvents = groupedEvents[cellKey] || [];

              const isEmpty = currentEvents.length === 0;
              const canClickEmpty = isEmpty && canAdd;
              const isDragOver = dragOverCell === cellKey;

              return (
                <div
                  key={cellKey}
                  className={`${styles.gridCell} ${canClickEmpty ? styles.emptyCell : ""} ${isDragOver ? styles.dragOver : ""}`}
                  onClick={() =>
                    canClickEmpty && handleOpenAddAtSlot(day, time)
                  }
                  role={isEmpty && canAdd ? "button" : undefined}
                  style={{ cursor: canClickEmpty ? "pointer" : "default" }}
                  onDragOver={(e) => onDragOver(e, cellKey)}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, day, time)}
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
