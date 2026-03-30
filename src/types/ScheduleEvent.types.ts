import type {
  ACTIVITY_TYPES,
  DAYS,
  EVENT_FREQUENCIES,
} from "@/constants/timetable.constants";
import type { Subject } from "./Subject.types";
import type { Teacher } from "./Teacher.types";
import type { Group } from "./Group.types";
import type { Room } from "./Room.types";

export type DayOfWeek = (typeof DAYS)[number];
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type EventFrequency = (typeof EVENT_FREQUENCIES)[number];

export interface ScheduleEvent {
  id: string;
  subject: Subject;
  teacher: Teacher;
  group: Group;
  room: Room;
  day: DayOfWeek;
  startHour: number;
  endHour: number;
  frequency: EventFrequency;
}

export interface ScheduleEventDTO {
  id?: string;
  subjectId: string;
  teacherId: string;
  groupId: string;
  roomId: string;
  day: DayOfWeek;
  startHour: number;
  endHour: number;
  frequency: EventFrequency;
}
