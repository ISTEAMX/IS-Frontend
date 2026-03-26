import type { ScheduleEvent } from "@/types/ScheduleEvent.types";

export const formatHour = (hour?: number): string => {
  if (hour === undefined || hour === null) return "00:00";
  return `${hour.toString().padStart(2, "0")}:00`;
};

export const generateSortedTimeSlots = (
  events: ScheduleEvent[],
  defaultSlots: readonly string[] = [],
): string[] => {
  if (!events) return [...defaultSlots];

  // Extract intervals from events
  const eventSlots = events
    .filter((e) => e.startHour !== undefined && e.endHour !== undefined)
    .map((e) => `${formatHour(e.startHour)} - ${formatHour(e.endHour)}`);

  // Combine with default slots and eliminate duplicates
  const combinedSlots = Array.from(new Set([...defaultSlots, ...eventSlots]));

  // Sort
  return combinedSlots.sort((a, b) => {
    const startA = parseInt(a.split(":")[0], 10);
    const startB = parseInt(b.split(":")[0], 10);

    if (startA === startB) {
      const endA = parseInt(a.split(" - ")[1].split(":")[0], 10);
      const endB = parseInt(b.split(" - ")[1].split(":")[0], 10);
      return endA - endB;
    }
    return startA - startB;
  });
};
