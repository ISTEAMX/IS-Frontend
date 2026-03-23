import type {
  ACTIVITY_TYPES,
  DAYS,
  EVENT_FREQUENCIES,
  TIME_SLOTS,
} from "@/constants/timetable.constants";

export type DayOfWeek = (typeof DAYS)[number];
export type TimeSlot = (typeof TIME_SLOTS)[number];
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
  timeSlot: TimeSlot;
  frequency: EventFrequency;
}
