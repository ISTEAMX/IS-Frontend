import type {
  ACTIVITY_TYPES,
  DAYS,
  EVENT_FREQUENCIES,
} from "@/constants/timetable.constants";

export type DayOfWeek = (typeof DAYS)[number];
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type EventFrequency = (typeof EVENT_FREQUENCIES)[number];

export interface ScheduleEvent {
  id: string;
  name: string;
  type: ActivityType;
  teacher: string;
  group: string;
  room: string;
  day: DayOfWeek;
  startHour: number;
  endHour: number;
  frequency: EventFrequency;
}
